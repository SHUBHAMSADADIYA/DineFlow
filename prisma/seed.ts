import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding DineFlow PostgreSQL database...');

  // 1. Create Super Admin user
  const adminUser = await prisma.platformUser.upsert({
    where: { email: 'superadmin@dineflow.com' },
    update: {},
    create: {
      email: 'superadmin@dineflow.com',
      passwordHash: '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', // sample hashed
      name: 'Super Administrator',
      role: 'SUPER_ADMIN',
    },
  });

  // 2. Create Restaurant Owner
  const ownerUser = await prisma.platformUser.upsert({
    where: { email: 'owner@zaika.com' },
    update: {},
    create: {
      email: 'owner@zaika.com',
      passwordHash: '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW',
      name: 'Shubham Sadadiya',
      role: 'RESTAURANT_OWNER',
    },
  });

  // 3. Create Subscription Plan
  const proPlan = await prisma.subscriptionPlan.upsert({
    where: { tier: 'ENTERPRISE' },
    update: {},
    create: {
      tier: 'ENTERPRISE',
      name: 'Enterprise Tier',
      priceMonthly: 4999,
      priceYearly: 49990,
      maxBranches: 10,
      maxOrders: 50000,
      hasKDS: true,
      hasInventory: true,
      hasAnalytics: true,
      hasLoyalty: true,
    },
  });

  // 4. Create Zaika Restaurant
  const restaurant = await prisma.restaurant.upsert({
    where: { slug: 'zaika' },
    update: {},
    create: {
      ownerId: ownerUser.id,
      name: 'Zaika Restaurant & Bar',
      slug: 'zaika',
      cuisineType: 'North Indian, Mughlai & Tandoor',
      description: 'Authentic royal dining and clay tandoor delicacies since 1998',
      supportPhone: '+91 95899 54890',
      supportEmail: 'contact@zaika.com',
    },
  });

  // 5. Create Branch
  const branch = await prisma.restaurantBranch.upsert({
    where: {
      restaurantId_slug: {
        restaurantId: restaurant.id,
        slug: 'ahmedabad',
      },
    },
    update: {},
    create: {
      restaurantId: restaurant.id,
      name: 'Ahmedabad Prahlad Nagar Branch',
      slug: 'ahmedabad',
      addressLine1: 'Shop 12-14, Titanium City Center, Prahlad Nagar',
      city: 'Ahmedabad',
      state: 'Gujarat',
      postalCode: '380015',
      phone: '+91 95899 54890',
      gstin: '24AAACZ1234F1Z5',
      fssaiNumber: '10723001000452',
      wifiSsid: 'Zaika_Guest_WiFi_5G',
      wifiPassword: 'zaikadelicious',
    },
  });

  // 6. Create Tables T01 - T06
  const tables = ['T01', 'T02', 'T03', 'T04', 'T05', 'T06'];
  for (const t of tables) {
    await prisma.restaurantTable.upsert({
      where: {
        branchId_tableNumber: {
          branchId: branch.id,
          tableNumber: t,
        },
      },
      update: {},
      create: {
        branchId: branch.id,
        tableNumber: t,
        capacity: 4,
        section: 'Main Dining',
        status: t === 'T05' ? 'PREPARING' : 'AVAILABLE',
      },
    });
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
