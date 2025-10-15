const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.onServiceRequestStatusChange = functions.firestore
    .document("serviceRequests/{requestId}")
    .onUpdate((change, context) => {
      const newValue = change.after.data();
      const previousValue = change.before.data();

      if (newValue.status !== previousValue.status) {
        const recipientEmail = newValue.email;
        const newStatus = newValue.status;
        const oldStatus = previousValue.status;

        console.log(`Service request ${context.params.requestId} status changed from ${oldStatus} to ${newStatus}.`);
        console.log(`Simulating sending email to ${recipientEmail}.`);

        // Here you would add your email sending logic.
        // For example, using a third-party email service like SendGrid, Mailgun, etc.
      }

      return null;
    });
