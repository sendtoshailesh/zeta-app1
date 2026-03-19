import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10)

  await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      password: hashedPassword,
      name: 'Test User',
    },
  })

  console.log('Seed complete — test user ready')

  // Sponsors
  const groceryCo = await prisma.sponsor.upsert({
    where: { id: 'sponsor-groceryco-001' },
    update: {},
    create: {
      id: 'sponsor-groceryco-001',
      name: 'GroceryCo',
      reportingPartition: 'groceryco-001',
    },
  })

  const fuelPlus = await prisma.sponsor.upsert({
    where: { id: 'sponsor-fuelplus-001' },
    update: {},
    create: {
      id: 'sponsor-fuelplus-001',
      name: 'FuelPlus',
      reportingPartition: 'fuelplus-001',
    },
  })

  const techDeals = await prisma.sponsor.upsert({
    where: { id: 'sponsor-techdeals-001' },
    update: {},
    create: {
      id: 'sponsor-techdeals-001',
      name: 'TechDeals',
      reportingPartition: 'techdeals-001',
    },
  })

  console.log('Sponsors seeded')

  const now = new Date()
  const daysAgo = (n: number) => new Date(now.getTime() - n * 24 * 60 * 60 * 1000)
  const daysFromNow = (n: number) => new Date(now.getTime() + n * 24 * 60 * 60 * 1000)

  // Offers
  await prisma.offer.upsert({
    where: { id: 'offer-10pct-groceries' },
    update: {},
    create: {
      id: 'offer-10pct-groceries',
      name: '10% Off Groceries',
      description: 'Save 10% on your grocery shop',
      offerType: 'PERCENTAGE_OFF',
      discountValue: 10,
      status: 'ACTIVE',
      source: 'MANUAL',
      sponsorId: groceryCo.id,
      effectiveDate: daysAgo(7),
      expirationDate: daysFromNow(30),
    },
  })

  await prisma.offer.upsert({
    where: { id: 'offer-5-off-fuel' },
    update: {},
    create: {
      id: 'offer-5-off-fuel',
      name: '$5 Off Fuel',
      description: 'Save $5 on your next fuel purchase',
      offerType: 'AMOUNT_OFF',
      discountValue: 5,
      status: 'ACTIVE',
      source: 'MANUAL',
      sponsorId: fuelPlus.id,
      effectiveDate: daysAgo(3),
      expirationDate: daysFromNow(14),
    },
  })

  await prisma.offer.upsert({
    where: { id: 'offer-fixed-electronics' },
    update: {},
    create: {
      id: 'offer-fixed-electronics',
      name: 'Fixed Price Electronics',
      description: 'Electronics at a fixed discounted price',
      offerType: 'FIXED_PRICE',
      discountValue: 99,
      status: 'CONFIGURED',
      source: 'MANUAL',
      sponsorId: techDeals.id,
      effectiveDate: daysFromNow(1),
      expirationDate: daysFromNow(60),
    },
  })

  await prisma.offer.upsert({
    where: { id: 'offer-summer-bundle' },
    update: {},
    create: {
      id: 'offer-summer-bundle',
      name: 'Summer Grocery Bundle',
      description: 'Bundle savings on summer grocery items',
      offerType: 'AMOUNT_OFF',
      discountValue: 15,
      status: 'DRAFT',
      source: 'MANUAL',
      sponsorId: groceryCo.id,
      effectiveDate: daysFromNow(7),
    },
  })

  await prisma.offer.upsert({
    where: { id: 'offer-weekend-fuel' },
    update: {},
    create: {
      id: 'offer-weekend-fuel',
      name: 'Weekend Fuel Discount',
      description: 'Discounted fuel prices every weekend',
      offerType: 'PERCENTAGE_OFF',
      discountValue: 8,
      status: 'SUSPENDED',
      source: 'MANUAL',
      sponsorId: fuelPlus.id,
      effectiveDate: daysAgo(14),
      expirationDate: daysFromNow(7),
    },
  })

  await prisma.offer.upsert({
    where: { id: 'offer-tech-clearance' },
    update: {},
    create: {
      id: 'offer-tech-clearance',
      name: 'Tech Clearance',
      description: 'Clearance sale on selected tech products',
      offerType: 'PERCENTAGE_OFF',
      discountValue: 20,
      status: 'EXPIRED',
      source: 'MANUAL',
      sponsorId: techDeals.id,
      effectiveDate: daysAgo(60),
      expirationDate: daysAgo(1),
    },
  })

  console.log('Offers seeded')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
