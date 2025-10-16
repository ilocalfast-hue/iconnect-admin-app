
const { initializeApp } = require("firebase/app");

const { getFirestore, collection, addDoc, serverTimestamp } = require("firebase/firestore");

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

async function createSampleJob() {
  try {
    const docRef = await addDoc(collection(firestore, "jobs"), {
      serviceName: "Plumbing Repair",
      customerName: "John Doe",
      providerName: "Jane Smith",
      scheduledTime: serverTimestamp(),
      review: "",
      createdAt: serverTimestamp(),
      status: "Pending",
    });
    console.log("✅ Sample job created with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

createSampleJob();
