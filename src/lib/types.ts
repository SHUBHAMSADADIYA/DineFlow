// DineFlow Core System Types

export type UserRole =
  | 'SUPER_ADMIN'
  | 'RESTAURANT_OWNER'
  | 'RESTAURANT_MANAGER'
  | 'WAITER'
  | 'CHEF'
  | 'CASHIER'
  | 'CUSTOMER';

export type TableStatus =
  | 'AVAILABLE'
  | 'OCCUPIED'
  | 'ORDERING'
  | 'PREPARING'
  | 'EATING'
  | 'BILL_REQUESTED'
  | 'PAYMENT_PENDING'
  | 'CLEANING'
  | 'RESERVED'
  | 'ASSISTANCE_REQUIRED';

export type OrderStatus =
  | 'PLACED'
  | 'ACCEPTED'
  | 'PREPARING'
  | 'READY'
  | 'SERVED'
  | 'COMPLETED'
  | 'CANCELLED';

export type KitchenTicketStatus =
  | 'NEW'
  | 'ACCEPTED'
  | 'PREPARING'
  | 'READY'
  | 'SERVED'
  | 'CANCELLED';

export type PaymentStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'SUCCESSFUL'
  | 'FAILED'
  | 'REFUNDED'
  | 'PARTIALLY_REFUNDED';

export type PaymentMethod =
  | 'CASH'
  | 'UPI'
  | 'CREDIT_CARD'
  | 'DEBIT_CARD'
  | 'NET_BANKING'
  | 'WALLET'
  | 'SPLIT';

export type FoodType = 'VEGETARIAN' | 'NON_VEGETARIAN' | 'VEGAN' | 'EGG';
export type SpiceLevel = 'MILD' | 'MEDIUM' | 'HOT' | 'EXTRA_HOT';

export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  coverImageUrl?: string;
  description?: string;
  cuisineType: string;
  fssaiNumber?: string;
  gstin?: string;
  address: string;
  city: string;
  phone: string;
  currencySymbol: string;
  cgstRate: number;
  sgstRate: number;
  serviceChargeRate: number;
  wifiSsid?: string;
  wifiPassword?: string;
}

export interface RestaurantTable {
  id: string;
  branchId: string;
  tableNumber: string; // T01, T02
  capacity: number;
  section: string; // "AC Dining", "Garden Terrace", "Rooftop"
  status: TableStatus;
  currentOrderId?: string;
  activeCustomerName?: string;
  activeGuestCount?: number;
  lastAssistanceNote?: string;
  qrCodeUrl?: string;
}

export interface MenuItemVariant {
  id: string;
  name: string; // e.g. "Half", "Full"
  price: number;
  isDefault?: boolean;
}

export interface MenuAddon {
  id: string;
  name: string; // e.g. "Extra Butter", "Extra Paneer"
  price: number;
}

export interface MenuItem {
  id: string;
  categoryId: string;
  categoryName: string;
  name: string;
  description: string;
  basePrice: number;
  discountedPrice?: number;
  foodType: FoodType;
  spiceLevel: SpiceLevel;
  prepTimeMinutes: number;
  imageUrl: string;
  isBestseller: boolean;
  isRecommended: boolean;
  isAvailable: boolean;
  stationName: string; // Tandoor, Curry, Chinese, Drinks, Dessert
  allergens: string[];
  variants?: MenuItemVariant[];
  addons?: MenuAddon[];
}

export interface OrderItemModifier {
  variantName?: string;
  variantPrice?: number;
  addons: { name: string; price: number }[];
  spiceLevel: SpiceLevel;
  specialInstructions?: string;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  unitPrice: number;
  quantity: number;
  modifiers: OrderItemModifier;
  totalPrice: number;
  itemStatus: OrderStatus;
  stationName: string;
}

export interface Order {
  id: string;
  orderNumber: string; // ORD-1042
  restaurantId: string;
  branchId: string;
  tableId: string;
  tableNumber: string;
  customerName?: string;
  customerPhone?: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  discountAmount: number;
  couponCode?: string;
  cgstAmount: number;
  sgstAmount: number;
  serviceCharge: number;
  tipAmount: number;
  finalAmount: number;
  specialNotes?: string;
  createdAt: string; // ISO string
  estimatedMinutesRemaining: number;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  isPaid: boolean;
}

export interface KitchenTicketItem {
  id: string;
  ticketId: string;
  itemName: string;
  quantity: number;
  variant?: string;
  addons?: string[];
  spiceLevel: string;
  notes?: string;
  status: KitchenTicketStatus;
  stationName: string;
}

export interface KitchenTicket {
  id: string;
  orderId: string;
  orderNumber: string;
  tableNumber: string;
  status: KitchenTicketStatus;
  priority: 'LOW' | 'NORMAL' | 'URGENT';
  targetPrepTime: number; // in mins
  createdAt: string;
  items: KitchenTicketItem[];
}

export interface AssistanceRequest {
  id: string;
  tableId: string;
  tableNumber: string;
  type: 'WATER' | 'NAPKINS' | 'CALL_WAITER' | 'REQUEST_MENU' | 'REQUEST_BILL' | 'CUSTOM';
  customNote?: string;
  status: 'PENDING' | 'ACKNOWLEDGED' | 'COMPLETED';
  createdAt: string;
  handledByName?: string;
}

export interface BillSplitItem {
  id: string;
  personName: string;
  amount: number;
  isPaid: boolean;
  paymentMethod?: PaymentMethod;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  unit: string;
  lowStockThreshold: number;
  costPerUnit: number;
}

export interface CustomerCRM {
  id: string;
  name: string;
  phone: string;
  email?: string;
  totalVisits: number;
  totalSpent: number;
  loyaltyPoints: number;
  lastVisit: string;
  favoriteDish: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: string;
}

export interface ReviewFeedback {
  id: string;
  orderNumber: string;
  customerName: string;
  rating: number; // 1-5
  comment: string;
  foodRating: number;
  serviceRating: number;
  ambianceRating: number;
  createdAt: string;
}
