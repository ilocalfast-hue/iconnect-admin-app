'use server'

import { firestore } from './firebase/server';

export async function saveServiceRequest(prevState: any, formData: FormData) {
  const serviceRequest = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    phone: formData.get('phone') as string,
    date: formData.get('date') as string,
    service: formData.get('service') as string,
    status: 'Pending', // Default status
    createdAt: new Date(),
  };

  try {
    await firestore.collection('serviceRequests').add(serviceRequest);
    return { message: 'Service request submitted successfully!' };
  } catch (error) {
    console.error('Error saving service request:', error);
    return { message: 'An error occurred while submitting your request.' };
  }
}
