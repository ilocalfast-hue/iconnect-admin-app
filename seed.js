
const admin = require('firebase-admin');
const serviceAccount = require('./iConnect-2068e-firebase-adminsdk-fbsvc-2c7acb8afa.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const users = [
  { name: 'John Doe', email: 'john.doe@example.com', role: 'Admin' },
  { name: 'Jane Smith', email: 'jane.smith@example.com', role: 'User' },
  { name: 'Peter Jones', email: 'peter.jones@example.com', role: 'User' },
];

const seedUsers = async () => {
  const usersCollection = db.collection('users');
  for (const user of users) {
    await usersCollection.add(user);
  }
  console.log('Users seeded successfully');
  process.exit(0);
};

seedUsers().catch(error => {
  console.error('Error seeding users:', error);
  process.exit(1);
});
