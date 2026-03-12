const { models } = require('./models');
const { usercontacts } = models;

async function seed() {
  try {
    console.log('🌱 Seeding demo data...');

    const demoData = [
      // Service Providers in Addis Ababa
      { phone_number: '+251911111111', chat_id: 'demo_p1', role: 'provider', category: 'Plumbing', location: 'Bole', service_details: 'Specialist in bathroom plumbing and leak repairs.' },
      { phone_number: '+251911222222', chat_id: 'demo_p2', role: 'provider', category: 'Electrician', location: 'Arada', service_details: 'Certified electrician for house wiring and appliance repair.' },
      { phone_number: '+251911333333', chat_id: 'demo_p3', role: 'provider', category: 'Cleaning', location: 'Kazanchis', service_details: 'Professional house and office cleaning services.' },
      { phone_number: '+251911444444', chat_id: 'demo_p4', role: 'provider', category: 'Plumbing', location: 'Arada', service_details: 'General plumbing services and water tank installation.' },
      { phone_number: '+251911555555', chat_id: 'demo_p5', role: 'provider', category: 'Carpentry', location: 'Old Airport', service_details: 'Custom furniture and wood repair specialist.' },
      { phone_number: '+251911666666', chat_id: 'demo_p6', role: 'provider', category: 'Electrician', location: 'Bole', service_details: '24/7 emergency electrical services.' },
      
      // Clients
      { phone_number: '+251922111111', chat_id: 'demo_c1', role: 'client', category: null, location: 'Bole', service_details: null },
      { phone_number: '+251922222222', chat_id: 'demo_c2', role: 'client', category: null, location: 'Arada', service_details: null },
    ];

    for (const data of demoData) {
      await usercontacts.upsert(data);
    }

    console.log('✅ Demo data seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
}

seed();
