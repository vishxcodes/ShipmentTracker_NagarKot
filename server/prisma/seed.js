import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const SEED_SHIPMENTS = [
  {
    trackingNumber: 'NF20260001',
    senderName: 'Amit Sharma',
    receiverName: 'Rahul Kumar',
    origin: 'Jammu',
    destination: 'Delhi',
    packageDescription: 'Electronic accessories',
    weight: 2.5,
    status: 'BOOKED',
    estimatedDeliveryDate: new Date('2026-09-25T00:00:00.000Z'),
    history: [
      {
        status: 'BOOKED',
        note: 'Shipment created and booking confirmed',
        location: 'Jammu Central Office',
        createdAt: new Date('2026-09-17T08:00:00.000Z'),
      },
    ],
  },
  {
    trackingNumber: 'NF20260002',
    senderName: 'Sunita Thapa',
    receiverName: 'Rajesh Shrestha',
    origin: 'Kathmandu',
    destination: 'Birgunj',
    packageDescription: 'Handloom textile materials',
    weight: 14.2,
    status: 'IN_TRANSIT',
    estimatedDeliveryDate: new Date('2026-09-22T00:00:00.000Z'),
    history: [
      {
        status: 'BOOKED',
        note: 'Shipment registered at Kathmandu central hub',
        location: 'Kathmandu Hub',
        createdAt: new Date('2026-09-15T09:30:00.000Z'),
      },
      {
        status: 'PICKED_UP',
        note: 'Package picked up by courier dispatch team',
        location: 'Kathmandu Hub',
        createdAt: new Date('2026-09-15T14:15:00.000Z'),
      },
      {
        status: 'IN_TRANSIT',
        note: 'Departed from Kathmandu sorting hub, en route to Birgunj via Narayanghat',
        location: 'Mugling Highway',
        createdAt: new Date('2026-09-16T11:00:00.000Z'),
      },
    ],
  },
  {
    trackingNumber: 'NF20260003',
    senderName: 'Anil Basnet',
    receiverName: 'Binod Gurung',
    origin: 'Lalitpur',
    destination: 'Pokhara',
    packageDescription: 'Automotive spare parts',
    weight: 8.0,
    status: 'DELIVERED',
    estimatedDeliveryDate: new Date('2026-09-18T00:00:00.000Z'),
    history: [
      {
        status: 'BOOKED',
        note: 'Shipment booking confirmed',
        location: 'Lalitpur Depot',
        createdAt: new Date('2026-09-14T07:45:00.000Z'),
      },
      {
        status: 'PICKED_UP',
        note: 'Handed over to carrier fleet',
        location: 'Lalitpur Depot',
        createdAt: new Date('2026-09-14T11:20:00.000Z'),
      },
      {
        status: 'IN_TRANSIT',
        note: 'In transit via Prithvi Highway',
        location: 'Damauli Checkpoint',
        createdAt: new Date('2026-09-15T15:00:00.000Z'),
      },
      {
        status: 'OUT_FOR_DELIVERY',
        note: 'Assigned to final mile delivery courier',
        location: 'Pokhara Delivery Station',
        createdAt: new Date('2026-09-16T08:30:00.000Z'),
      },
      {
        status: 'DELIVERED',
        note: 'Successfully delivered and signed by recipient Binod Gurung',
        location: 'Pokhara Recipient Address',
        createdAt: new Date('2026-09-16T13:45:00.000Z'),
      },
    ],
  },
];

async function main() {
  console.log('🌱 Starting idempotent database seed...');

  for (const item of SEED_SHIPMENTS) {
    const existing = await prisma.shipment.findUnique({
      where: { trackingNumber: item.trackingNumber },
    });

    if (existing) {
      console.log(`ℹ️ [SKIP] Shipment '${item.trackingNumber}' already exists (ID: ${existing.id}). No changes made.`);
      continue;
    }

    const { history, ...shipmentData } = item;

    const created = await prisma.$transaction(async (tx) => {
      const s = await tx.shipment.create({
        data: {
          ...shipmentData,
          statusHistory: {
            create: history,
          },
        },
      });
      return s;
    });

    console.log(`✅ [CREATED] Shipment '${created.trackingNumber}' (${created.status}) with ${history.length} history records.`);
  }

  console.log('✨ Seed process completed successfully.');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
