'use server'

import { firestore } from './firebase/server';

export async function saveServiceRequest(prevState: any, formData: FormData) {
  const jobData = {
    customerName: formData.get('name') as string,
    customerEmail: formData.get('email') as string,
    customerPhone: formData.get('phone') as string,
    scheduledTime: new Date(formData.get('date') as string),
    serviceName: formData.get('service') as string,
    status: 'Pending', // Default status for a new job
    createdAt: new Date(),
    providerName: 'Unassigned', // Default provider
    review: '', // No review initially
  };

  try {
    await firestore.collection('jobs').add(jobData);
    return { message: 'Service request submitted successfully! It is now pending in the admin dashboard.' };
  } catch (error) {
    console.error('Error saving job request:', error);
    return { message: 'An error occurred while submitting your request.' };
  }
}
