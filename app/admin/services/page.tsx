'use client'
import React, { useState, useMemo, useEffect } from "react"
import { PlusIcon, PencilIcon, TrashIcon, ChevronUpIcon, ChevronDownIcon, StarIcon as StarIconSolid, MagnifyingGlassIcon } from "@heroicons/react/24/solid"
import { StarIcon as StarIconOutline } from "@heroicons/react/24/outline"
import { firestore } from "../../firebase/client";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";

// --- TYPES ---

type Service = {
  id: string;
  name: string;
  category: 'Beauty' | 'Wellness' | 'Fitness' | 'Medical';
  price: number;
  duration: number; // in minutes
  status: 'Active' | 'Inactive';
  featured: boolean;
  createdAt: any; // Firestore timestamp
};

// --- HELPER COMPONENTS ---

const CategoryBadge = ({ category }: { category: Service['category'] }) => {
  const styles = {
    Beauty: 'bg-pink-100 text-pink-800',
    Wellness: 'bg-blue-100 text-blue-800',
    Fitness: 'bg-green-100 text-green-800',
    Medical: 'bg-red-100 text-red-800',
  }
  return <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[category]}`}>{category}</span>
}

const ToggleSwitch = ({ enabled, onChange }: { enabled: boolean, onChange: (enabled: boolean) => void }) => (
    <div 
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors duration-300 ease-in-out ${enabled ? 'bg-green-500' : 'bg-gray-300'}`}
    >
        <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ease-in-out ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
    </div>
);

// --- MAIN PAGE COMPONENT ---

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: keyof Service; direction: 'asc' | 'desc' } | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(firestore, "services"), (snapshot) => {
        const newServices = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Service));
        setServices(newServices);
    });

    return () => unsubscribe();
  }, []);

  const handleStatusChange = async (serviceId: string, newStatus: 'Active' | 'Inactive') => {
    const serviceRef = doc(firestore, "services", serviceId);
    await updateDoc(serviceRef, { status: newStatus });
  };

  const handleFeatureChange = async (serviceId: string, newFeatured: boolean) => {
    const serviceRef = doc(firestore, "services", serviceId);
    await updateDoc(serviceRef, { featured: newFeatured });
};

  const filteredAndSortedServices = useMemo(() => {
    let sortedServices = [...services];

    if (sortConfig !== null) {
      sortedServices.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return sortedServices.filter(service =>
      service.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [services, searchTerm, sortConfig]);

  const requestSort = (key: keyof Service) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  const serviceColumns = [
    { key: 'name', label: 'Service Name', sortable: true },
    { key: 'category', label: 'Category' },
    { key: 'price', label: 'Price', sortable: true },
    { key: 'duration', label: 'Duration' },
    { key: 'status', label: 'Status' },
    { key: 'featured', label: 'Featured' },
    { key: 'createdAt', label: 'Created', sortable: true },
    { key: 'actions', label: 'Actions' }
  ];

  const renderCell = (service: Service, key: string) => {
    const cellValue = service[key as keyof Service];

    switch (key) {
        case 'name':
            return <div className="font-medium text-gray-900">{service.name}</div>;
        case 'category':
            return <CategoryBadge category={service.category} />;
        case 'price':
            return <span className="text-sm text-gray-800">${(cellValue as number).toFixed(2)}</span>;
        case 'duration':
            return <span className="text-sm text-gray-600">{cellValue} min</span>;
        case 'status':
            return <ToggleSwitch enabled={cellValue === 'Active'} onChange={(newEnabled) => handleStatusChange(service.id, newEnabled ? 'Active' : 'Inactive')} />;
        case 'featured':
            return <div className="flex justify-center"><button onClick={() => handleFeatureChange(service.id, !service.featured)}>{cellValue ? <StarIconSolid className="h-5 w-5 text-yellow-500" /> : <StarIconOutline className="h-5 w-5 text-gray-300" />}</button></div>;
        case 'createdAt':
            return <span className="text-sm text-gray-600">{new Date((cellValue as any).seconds * 1000).toLocaleDateString()}</span>;
        case 'actions':
            return (
                <div className="flex items-center space-x-3">
                    <button className="text-blue-600 hover:text-blue-900 transition-colors"><PencilIcon className="h-5 w-5" /></button>
                    <button className="text-red-600 hover:text-red-900 transition-colors"><TrashIcon className="h-5 w-5" /></button>
                </div>
            );
        default:
            return <span className="text-sm text-gray-600">{String(cellValue)}</span>;
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Service Management</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ease-in-out flex items-center">
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Service
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center mb-4">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by service name..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {serviceColumns.map((col) => (
                  <th 
                    key={col.key} 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    onClick={() => col.sortable && requestSort(col.key as keyof Service)}
                  >
                    <div className="flex items-center">
                      {col.label}
                      {col.sortable && (
                        <span className="ml-1">
                          {sortConfig?.key === col.key ? (
                            sortConfig.direction === 'asc' ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />
                          ) : (
                            <ChevronUpIcon className="h-4 w-4 text-gray-300" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAndSortedServices.map((service) => (
                <tr key={service.id} className="hover:bg-gray-50 transition-colors">
                  {serviceColumns.map(col => (
                    <td key={col.key} className="px-6 py-4 whitespace-nowrap">
                      {renderCell(service, col.key)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
