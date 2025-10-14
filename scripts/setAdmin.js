const admin = require('firebase-admin');

// Path to your service account key file
const serviceAccount = require('../iConnect-2068e-firebase-adminsdk-fbsvc-2c7acb8afa.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const email = 'ilocalfast@gmail.com';

(async () => {
  try {
    console.log(`Fetching user: ${email}...`);
    const user = await admin.auth().getUserByEmail(email);
    console.log(`Setting custom claim for user: ${user.uid}...`);
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });
    console.log(`✅ Successfully set admin claim for ${email}`);
  } catch (error) {
    console.error(`❌ Error setting custom claim: ${error.message}`);
  }
})();
