'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '@/app/firebase';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newService, setNewService] = useState({ name: '', description: '', price: 0 });
  const [editingService, setEditingService] = useState<Service | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      const servicesCollection = await getDocs(collection(db, 'services'));
      setServices(servicesCollection.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service)));
    };
    fetchServices();
  }, []);

  const handleAddService = async () => {
    if (newService.name && newService.description) {
      const docRef = await addDoc(collection(db, 'services'), newService);
      setServices([...services, { id: docRef.id, ...newService }]);
      setNewService({ name: '', description: '', price: 0 });
      setIsAddModalOpen(false);
    }
  };

  const handleEditService = async () => {
    if (editingService) {
      await setDoc(doc(db, 'services', editingService.id), {
        name: editingService.name,
        description: editingService.description,
        price: editingService.price,
      });
      setServices(services.map(service => service.id === editingService.id ? editingService : service));
      setEditingService(null);
      setIsEditModalOpen(false);
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    await deleteDoc(doc(db, 'services', serviceId));
    setServices(services.filter(service => service.id !== serviceId));
  };

  const openEditModal = (service: Service) => {
    setEditingService(service);
    setIsEditModalOpen(true);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900">Services</h1>
      <p className="mt-4 text-lg text-gray-600">Manage the services offered on the platform.</p>
      <div className="mt-8">
        <div className="flex justify-end">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Add Service
          </button>
        </div>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full whitespace-nowrap">
            <thead className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y">
              {services.map((service) => (
                <tr key={service.id} className="text-gray-700">
                  <td className="px-4 py-3 text-sm font-semibold">{service.name}</td>
                  <td className="px-4 py-3 text-sm">{service.description}</td>
                  <td className="px-4 py-3 text-sm">${service.price}</td>
                  <td className="px-4 py-3 text-sm">
                    <button
                      onClick={() => openEditModal(service)}
                      className="px-2 py-1 mr-2 text-sm font-medium text-blue-600 border border-transparent rounded-md hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteService(service.id)}
                      className="px-2 py-1 text-sm font-medium text-red-600 border border-transparent rounded-md hover:text-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Service Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 bg-white rounded-md">
            <h2 className="text-2xl font-bold">Add Service</h2>
            <div className="mt-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  id="name"
                  value={newService.name}
                  onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div className="mt-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  id="description"
                  value={newService.description}
                  onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div className="mt-4">
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
                <input
                  type="number"
                  id="price"
                  value={newService.price}
                  onChange={(e) => setNewService({ ...newService, price: Number(e.target.value) })}
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 mr-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleAddService}
                className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Add Service
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Service Modal */}
      {isEditModalOpen && editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 bg-white rounded-md">
            <h2 className="text-2xl font-bold">Edit Service</h2>
            <div className="mt-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  id="name"
                  value={editingService.name}
                  onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div className="mt-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  id="description"
                  value={editingService.description}
                  onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div className="mt-4">
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
                <input
                  type="number"
                  id="price"
                  value={editingService.price}
                  onChange={(e) => setEditingService({ ...editingService, price: Number(e.target.value) })}
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 mr-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleEditService}
                className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
