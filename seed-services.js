
const admin = require('firebase-admin');
// Assuming you have the service account key in the root directory
const serviceAccount = require('./iConnect-2068e-firebase-adminsdk-fbsvc-2c7acb8afa.json');

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
} catch (error) {
  if (error.code !== 'app/duplicate-app') {
    console.error('Firebase admin initialization error', error);
  }
}

const db = admin.firestore();

const services = [
  { name: 'Web Development', description: 'Full-stack web development services.', price: 1000 },
  { name: 'Mobile App Development', description: 'Native and hybrid mobile app development.', price: 1500 },
  { name: 'UI/UX Design', description: 'User interface and user experience design.', price: 500 },
];

const seedServices = async () => {
  const servicesCollection = db.collection('services');
  console.log('Seeding services...');
  for (const service of services) {
    await servicesCollection.add(service);
  }
  console.log('Services seeded successfully');
  process.exit(0);
};

seedServices().catch(error => {
  console.error('Error seeding services:', error);
  process.exit(1);
});
