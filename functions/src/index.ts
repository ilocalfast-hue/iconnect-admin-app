import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

const db = admin.firestore();

export const adminApproveRequest = functions.https.onCall(async (data, context) => {
  // Check for admin custom claim
  if (!context.auth?.token.admin) {
    throw new functions.https.HttpsError(
      "permission-denied",
      "Must be an administrative user to approve requests."
    );
  }

  const { jobId } = data;

  if (!jobId) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "The function must be called with one argument 'jobId'."
    );
  }

  const jobRef = db.collection("jobs").doc(jobId);

  await jobRef.update({ status: "approved" });

  await db.collection("transactions").add({
    adminUid: context.auth.uid,
    action: "approve_job",
    jobId: jobId,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { result: `Job ${jobId} approved.` };
});

export const adminRejectRequest = functions.https.onCall(async (data, context) => {
    // Check for admin custom claim
    if (!context.auth?.token.admin) {
        throw new functions.https.HttpsError(
            "permission-denied",
            "Must be an administrative user to reject requests."
        );
    }

    const { jobId } = data;

    if (!jobId) {
        throw new functions.https.HttpsError(
            "invalid-argument",
            "The function must be called with one argument 'jobId'."
        );
    }

    const jobRef = db.collection("jobs").doc(jobId);

    await jobRef.update({ status: "rejected" });

    await db.collection("transactions").add({
        adminUid: context.auth.uid,
        action: "reject_job",
        jobId: jobId,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { result: `Job ${jobId} rejected.` };
});

export const adminAdjustCredits = functions.https.onCall(async (data, context) => {
    // Check for admin custom claim
    if (!context.auth?.token.admin) {
        throw new functions.https.HttpsError(
            "permission-denied",
            "Must be an administrative user to adjust credits."
        );
    }

    const { userId, amount } = data;

    if (!userId || typeof amount !== "number") {
        throw new functions.https.HttpsError(
            "invalid-argument",
            "The function must be called with 'userId' and 'amount'."
        );
    }

    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
        throw new functions.https.HttpsError("not-found", `User ${userId} not found.`);
    }

    const currentCredits = userDoc.data()?.credits || 0;
    const newCredits = currentCredits + amount;

    await userRef.update({ credits: newCredits });

    await db.collection("transactions").add({
        adminUid: context.auth.uid,
        action: "adjust_credits",
        userId: userId,
        amount: amount,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { result: `User ${userId} credits adjusted to ${newCredits}.` };
});

export const purchaseLead = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError(
            "unauthenticated",
            "You must be logged in to purchase a lead."
        );
    }

    const { leadId } = data;
    const userId = context.auth.uid;

    if (!leadId) {
        throw new functions.https.HttpsError(
            "invalid-argument",
            "The function must be called with one argument 'leadId'."
        );
    }
    
    const leadRef = db.collection("leads").doc(leadId);
    const userRef = db.collection("users").doc(userId);
    
    const leadDoc = await leadRef.get();
    const userDoc = await userRef.get();

    if (!leadDoc.exists) {
        throw new functions.https.HttpsError("not-found", `Lead ${leadId} not found.`);
    }

    if (!userDoc.exists) {
        throw new functions.https.HttpsError("not-found", `User ${userId} not found.`);
    }
    
    const leadCost = leadDoc.data()?.cost || 1; // Default cost to 1 credit
    const userCredits = userDoc.data()?.credits || 0;

    if (userCredits < leadCost) {
        throw new functions.https.HttpsError("failed-precondition", "Insufficient credits.");
    }
    
    const newCredits = userCredits - leadCost;
    
    await userRef.update({ credits: newCredits });
    
    // Grant access to lead. This could be done in a number of ways.
    // For this example, we'll add the user's UID to a list of 'buyers' on the lead.
    await leadRef.update({
        buyers: admin.firestore.FieldValue.arrayUnion(userId)
    });

    await db.collection("transactions").add({
        userId: userId,
        action: "purchase_lead",
        leadId: leadId,
        cost: leadCost,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { result: `Lead ${leadId} purchased successfully.` };
});
