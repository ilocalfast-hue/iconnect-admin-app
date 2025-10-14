const admin = require('firebase-admin');

// Path to your service account key file
const serviceAccount = require('../iConnect-2068e-firebase-adminsdk-fbsvc-2c7acb8afa.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const email = 'ilocalfast@gmail.com';
const password = 'password';

(async () => {
  try {
    console.log(`Creating user: ${email}...`);
    const userRecord = await admin.auth().createUser({
        email: email,
        password: password,
    });
    console.log(`Successfully created new user: ${userRecord.uid}`);
    console.log(`Setting custom claim for user: ${userRecord.uid}...`);
    await admin.auth().setCustomUserClaims(userRecord.uid, { admin: true });
    console.log(`✅ Successfully set admin claim for ${email}`);

  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
  }
})();
