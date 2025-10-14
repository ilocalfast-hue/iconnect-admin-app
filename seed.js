
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc } = require('firebase/firestore');

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const seedRequests = async () => {
    const requestsCollection = collection(db, 'requests');
  
    const requests = [
      { name: 'John Doe', email: 'john.doe@example.com', request: 'I need help with my account.', status: 'Pending' },
      { name: 'Jane Smith', email: 'jane.smith@example.com', request: 'I want to upgrade my subscription.', status: 'Pending' },
      { name: 'Peter Jones', email: 'peter.jones@example.com', request: 'I have a billing question.', status: 'Completed' },
    ];
  
    for (const request of requests) {
      await addDoc(requestsCollection, request);
    }
  };

  seedRequests().then(() => {
      console.log('database seeded');
      process.exit(0)
  });
