import {
  Restaurant,
  RestaurantTable,
  MenuItem,
  Order,
  KitchenTicket,
  AssistanceRequest,
  InventoryItem,
  CustomerCRM,
  ReviewFeedback,
  OrderStatus,
  KitchenTicketStatus,
  TableStatus,
} from './types';
import {
  INITIAL_RESTAURANT,
  INITIAL_TABLES,
  INITIAL_MENU_ITEMS,
  INITIAL_ORDERS,
  INITIAL_KITCHEN_TICKETS,
  INITIAL_ASSISTANCE_REQUESTS,
  INITIAL_INVENTORY,
  INITIAL_CUSTOMERS,
  INITIAL_REVIEWS,
} from './seed-data';

// Singleton in-memory store for instant multi-dashboard reactivity
class DineFlowStore {
  private static instance: DineFlowStore;

  restaurant: Restaurant = { ...INITIAL_RESTAURANT };
  tables: RestaurantTable[] = JSON.parse(JSON.stringify(INITIAL_TABLES));
  menuItems: MenuItem[] = JSON.parse(JSON.stringify(INITIAL_MENU_ITEMS));
  orders: Order[] = JSON.parse(JSON.stringify(INITIAL_ORDERS));
  kitchenTickets: KitchenTicket[] = JSON.parse(JSON.stringify(INITIAL_KITCHEN_TICKETS));
  assistanceRequests: AssistanceRequest[] = JSON.parse(JSON.stringify(INITIAL_ASSISTANCE_REQUESTS));
  inventory: InventoryItem[] = JSON.parse(JSON.stringify(INITIAL_INVENTORY));
  customers: CustomerCRM[] = JSON.parse(JSON.stringify(INITIAL_CUSTOMERS));
  reviews: ReviewFeedback[] = JSON.parse(JSON.stringify(INITIAL_REVIEWS));

  private constructor() {}

  public static getInstance(): DineFlowStore {
    if (!DineFlowStore.instance) {
      DineFlowStore.instance = new DineFlowStore();
    }
    return DineFlowStore.instance;
  }

  // --- TABLES ---
  getTables(): RestaurantTable[] {
    return this.tables;
  }

  getTableByNumber(tableNumber: string): RestaurantTable | undefined {
    return this.tables.find(
      (t) => t.tableNumber.toLowerCase() === tableNumber.toLowerCase()
    );
  }

  updateTableStatus(tableId: string, status: TableStatus, details?: Partial<RestaurantTable>) {
    const table = this.tables.find((t) => t.id === tableId || t.tableNumber === tableId);
    if (table) {
      table.status = status;
      if (details) {
        Object.assign(table, details);
      }
      if (status === 'AVAILABLE') {
        table.currentOrderId = undefined;
        table.activeCustomerName = undefined;
        table.activeGuestCount = undefined;
      }
    }
    return table;
  }

  // --- ORDERS ---
  getOrders(): Order[] {
    return [...this.orders].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  getOrderById(id: string): Order | undefined {
    return this.orders.find((o) => o.id === id || o.orderNumber === id);
  }

  getOrderByTableNumber(tableNumber: string): Order | undefined {
    return this.orders.find(
      (o) =>
        o.tableNumber.toLowerCase() === tableNumber.toLowerCase() &&
        o.status !== 'COMPLETED' &&
        o.status !== 'CANCELLED'
    );
  }

  createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>): Order {
    const newOrderNumber = `ORD-${1043 + this.orders.length}`;
    const newId = `ord-${Date.now()}`;
    const newOrder: Order = {
      ...orderData,
      id: newId,
      orderNumber: newOrderNumber,
      createdAt: new Date().toISOString(),
    };

    this.orders.unshift(newOrder);

    // Update associated table
    this.updateTableStatus(newOrder.tableId, 'ORDERING', {
      currentOrderId: newOrder.orderNumber,
      activeCustomerName: newOrder.customerName,
      activeGuestCount: 2,
    });

    // Create KDS ticket automatically
    const newTicketId = `kds-ticket-${newOrderNumber}`;
    const newTicket: KitchenTicket = {
      id: newTicketId,
      orderId: newOrder.id,
      orderNumber: newOrder.orderNumber,
      tableNumber: newOrder.tableNumber,
      status: 'NEW',
      priority: 'NORMAL',
      targetPrepTime: 18,
      createdAt: new Date().toISOString(),
      items: newOrder.items.map((item, idx) => ({
        id: `kti-${newId}-${idx}`,
        ticketId: newTicketId,
        itemName: item.name,
        quantity: item.quantity,
        variant: item.modifiers?.variantName,
        addons: item.modifiers?.addons?.map((a) => a.name) || [],
        spiceLevel: item.modifiers?.spiceLevel || 'MEDIUM',
        notes: item.modifiers?.specialInstructions,
        status: 'NEW',
        stationName: item.stationName || 'Curry',
      })),
    };
    this.kitchenTickets.unshift(newTicket);

    // Auto deduct inventory ingredients
    this.deductIngredientsForOrder(newOrder);

    return newOrder;
  }

  updateOrderStatus(orderId: string, status: OrderStatus): Order | undefined {
    const order = this.orders.find((o) => o.id === orderId || o.orderNumber === orderId);
    if (order) {
      order.status = status;

      // Sync Table Status
      if (status === 'PREPARING') {
        this.updateTableStatus(order.tableId, 'PREPARING');
      } else if (status === 'SERVED') {
        this.updateTableStatus(order.tableId, 'EATING');
      } else if (status === 'COMPLETED') {
        this.updateTableStatus(order.tableId, 'AVAILABLE');
      }

      // Also update kitchen ticket if completed or cancelled
      const ticket = this.kitchenTickets.find(
        (t) => t.orderId === order.id || t.orderNumber === order.orderNumber
      );
      if (ticket) {
        if (status === 'PREPARING') ticket.status = 'PREPARING';
        if (status === 'READY') {
          ticket.status = 'READY';
          ticket.items.forEach((item) => (item.status = 'READY'));
        }
        if (status === 'SERVED') ticket.status = 'SERVED';
      }
    }
    return order;
  }

  // --- KITCHEN TICKETS ---
  getKitchenTickets(stationFilter?: string): KitchenTicket[] {
    if (!stationFilter || stationFilter === 'ALL') {
      return this.kitchenTickets;
    }
    return this.kitchenTickets
      .map((ticket) => ({
        ...ticket,
        items: ticket.items.filter(
          (item) => item.stationName.toLowerCase() === stationFilter.toLowerCase()
        ),
      }))
      .filter((ticket) => ticket.items.length > 0);
  }

  updateTicketItemStatus(
    ticketId: string,
    itemId: string,
    status: KitchenTicketStatus
  ): KitchenTicket | undefined {
    const ticket = this.kitchenTickets.find((t) => t.id === ticketId);
    if (!ticket) return undefined;

    const item = ticket.items.find((i) => i.id === itemId);
    if (item) {
      item.status = status;
    }

    // If all items ready, mark ticket ready and advance customer order
    const allReady = ticket.items.every((i) => i.status === 'READY');
    const anyPreparing = ticket.items.some((i) => i.status === 'PREPARING');

    if (allReady) {
      ticket.status = 'READY';
      const order = this.orders.find((o) => o.id === ticket.orderId || o.orderNumber === ticket.orderNumber);
      if (order && order.status !== 'SERVED' && order.status !== 'COMPLETED') {
        order.status = 'READY';
      }
    } else if (anyPreparing) {
      ticket.status = 'PREPARING';
      const order = this.orders.find((o) => o.id === ticket.orderId || o.orderNumber === ticket.orderNumber);
      if (order && order.status === 'ACCEPTED') {
        order.status = 'PREPARING';
        this.updateTableStatus(order.tableId, 'PREPARING');
      }
    }

    return ticket;
  }

  // --- ASSISTANCE REQUESTS ---
  getAssistanceRequests(): AssistanceRequest[] {
    return [...this.assistanceRequests].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  createAssistanceRequest(
    data: Omit<AssistanceRequest, 'id' | 'createdAt' | 'status'>
  ): AssistanceRequest {
    const newRequest: AssistanceRequest = {
      ...data,
      id: `ast-${Date.now()}`,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };
    this.assistanceRequests.unshift(newRequest);

    // Update table status to ASSISTANCE_REQUIRED
    this.updateTableStatus(data.tableId, 'ASSISTANCE_REQUIRED', {
      lastAssistanceNote: data.customNote || data.type,
    });

    return newRequest;
  }

  updateAssistanceStatus(
    id: string,
    status: 'ACKNOWLEDGED' | 'COMPLETED',
    handledByName?: string
  ): AssistanceRequest | undefined {
    const req = this.assistanceRequests.find((r) => r.id === id);
    if (req) {
      req.status = status;
      if (handledByName) req.handledByName = handledByName;

      if (status === 'COMPLETED') {
        const table = this.tables.find((t) => t.id === req.tableId);
        if (table && table.status === 'ASSISTANCE_REQUIRED') {
          table.status = table.currentOrderId ? 'EATING' : 'AVAILABLE';
        }
      }
    }
    return req;
  }

  // --- MENU ---
  getMenuItems(category?: string): MenuItem[] {
    if (!category || category === 'ALL') {
      return this.menuItems;
    }
    return this.menuItems.filter(
      (m) => m.categoryName.toLowerCase() === category.toLowerCase()
    );
  }

  getMenuItemById(id: string): MenuItem | undefined {
    return this.menuItems.find((m) => m.id === id);
  }

  toggleMenuItemAvailability(id: string): MenuItem | undefined {
    const item = this.menuItems.find((m) => m.id === id);
    if (item) {
      item.isAvailable = !item.isAvailable;
    }
    return item;
  }

  // --- INVENTORY ---
  getInventory(): InventoryItem[] {
    return this.inventory;
  }

  adjustStock(id: string, amount: number): InventoryItem | undefined {
    const item = this.inventory.find((i) => i.id === id);
    if (item) {
      item.currentStock = Math.max(0, Math.round((item.currentStock + amount) * 100) / 100);
    }
    return item;
  }

  private deductIngredientsForOrder(order: Order) {
    // Recipe stock auto-deduction logic
    order.items.forEach((item) => {
      if (item.name.includes('Paneer')) {
        this.adjustStock('inv-1', -0.2 * item.quantity); // 200g paneer
        this.adjustStock('inv-2', -0.03 * item.quantity); // 30g butter
      }
      if (item.name.includes('Naan')) {
        this.adjustStock('inv-8', -0.1 * item.quantity); // 100g flour
        this.adjustStock('inv-2', -0.02 * item.quantity); // 20g butter
      }
      if (item.name.includes('Biryani')) {
        this.adjustStock('inv-5', -0.15 * item.quantity); // 150g basmati rice
      }
      if (item.name.includes('Mango Lassi')) {
        this.adjustStock('inv-6', -0.1 * item.quantity); // pulp
      }
    });
  }

  // --- CRM & LOYALTY ---
  getCustomerByPhone(phone: string): CustomerCRM | undefined {
    return this.customers.find((c) => c.phone.replace(/\s+/g, '') === phone.replace(/\s+/g, ''));
  }

  addLoyaltyPoints(phone: string, points: number): CustomerCRM {
    let customer = this.getCustomerByPhone(phone);
    if (!customer) {
      customer = {
        id: `c-${Date.now()}`,
        name: 'Valued Guest',
        phone,
        totalVisits: 1,
        totalSpent: 0,
        loyaltyPoints: points,
        lastVisit: 'Today',
        favoriteDish: 'Paneer Makhani',
      };
      this.customers.push(customer);
    } else {
      customer.loyaltyPoints += points;
      customer.totalVisits += 1;
      customer.lastVisit = 'Today';
    }
    return customer;
  }

  redeemLoyaltyPoints(phone: string, pointsToRedeem: number): boolean {
    const customer = this.getCustomerByPhone(phone);
    if (customer && customer.loyaltyPoints >= pointsToRedeem) {
      customer.loyaltyPoints -= pointsToRedeem;
      return true;
    }
    return false;
  }

  // --- REVIEWS ---
  getReviews(): ReviewFeedback[] {
    return this.reviews;
  }

  addReview(review: Omit<ReviewFeedback, 'id' | 'createdAt'>): ReviewFeedback {
    const newRev: ReviewFeedback = {
      ...review,
      id: `rev-${Date.now()}`,
      createdAt: 'Just now',
    };
    this.reviews.unshift(newRev);
    return newRev;
  }

  // --- BILL PAYMENT ---
  payBill(orderId: string, paymentMethod: any, amountPaid: number): Order | undefined {
    const order = this.orders.find((o) => o.id === orderId || o.orderNumber === orderId);
    if (order) {
      order.isPaid = true;
      order.paymentStatus = 'SUCCESSFUL';
      order.paymentMethod = paymentMethod;

      // Credit 5 loyalty points per 100 spent
      if (order.customerPhone) {
        const points = Math.floor((order.finalAmount / 100) * 5);
        this.addLoyaltyPoints(order.customerPhone, points);
      }

      // Mark table available or cleaning
      this.updateTableStatus(order.tableId, 'CLEANING');
    }
    return order;
  }

  // --- ANALYTICS ---
  getTodayAnalytics() {
    const totalOrders = this.orders.length;
    const grossSales = this.orders.reduce((sum, o) => sum + o.finalAmount, 0);
    const activeTables = this.tables.filter((t) => t.status !== 'AVAILABLE').length;
    const totalTables = this.tables.length;
    const pendingKitchen = this.kitchenTickets.filter(
      (t) => t.status === 'NEW' || t.status === 'PREPARING'
    ).length;
    const avgOrderValue = totalOrders > 0 ? Math.round(grossSales / totalOrders) : 0;

    return {
      grossSales: Math.round(grossSales),
      totalOrders,
      activeTables,
      totalTables,
      pendingKitchen,
      avgOrderValue,
      tableOccupancyRate: Math.round((activeTables / totalTables) * 100),
    };
  }
}

export const dineFlowStore = DineFlowStore.getInstance();
