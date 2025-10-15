'use client';

import { useFormState } from 'react-dom';
import { saveServiceRequest } from './actions';

const initialState = {
  message: '',
};

export default function ServiceRequestForm() {
  const [state, formAction] = useFormState(saveServiceRequest, initialState);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
      <div className="max-w-xl w-full mx-auto p-8 bg-white rounded-xl shadow-lg">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">Request a Service</h1>
        <p className="text-center text-gray-600 mb-8">Submit your service request and we'll get back to you shortly.</p>

        <form action={formAction}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-control">
              <label htmlFor="name" className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input type="text" id="name" name="name" className="input input-bordered w-full" required />
            </div>
            <div className="form-control">
              <label htmlFor="email" className="label">
                <span className="label-text">Email Address</span>
              </label>
              <input type="email" id="email" name="email" className="input input-bordered w-full" required />
            </div>
            <div className="form-control">
              <label htmlFor="phone" className="label">
                <span className="label-text">Phone Number</span>
              </label>
              <input type="tel" id="phone" name="phone" className="input input-bordered w-full" />
            </div>
            <div className="form-control">
              <label htmlFor="date" className="label">
                <span className="label-text">Preferred Date</span>
              </label>
              <input type="date" id="date" name="date" className="input input-bordered w-full" />
            </div>
          </div>

          <div className="form-control mt-6">
            <label htmlFor="service" className="label">
              <span className="label-text">Service Description</span>
            </label>
            <textarea id="service" name="service" className="textarea textarea-bordered w-full h-32" required></textarea>
          </div>

          <div className="mt-8 text-center">
            <button type="submit" className="btn btn-primary btn-wide">
              Submit Request
            </button>
          </div>
        </form>

        {state?.message && (
          <p className="mt-4 text-center text-green-600 font-semibold">
            {state.message}
          </p>
        )}
      </div>
    </div>
  );
}
