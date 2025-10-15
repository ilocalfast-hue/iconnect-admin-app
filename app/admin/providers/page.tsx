'use client'
import React, { useState, useMemo, useEffect } from "react"
import { PlusIcon, PencilIcon, TrashIcon, ChevronUpIcon, ChevronDownIcon, CheckCircleIcon, XCircleIcon, ClockIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid"
import { firestore } from "../../firebase/client";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";

// --- TYPES ---

type Provider = {
    id: string;
    businessName: string;
    ownerName: string;
    email: string;
    phone: string;
    services: string[];
    rating: number;
    jobsCompleted: number;
    verification: 'Verified' | 'Pending' | 'Rejected';
    availability: 'Available' | 'Unavailable';
    memberSince: any; // Firestore timestamp
};

// --- HELPER COMPONENTS ---

const VerificationStatus = ({ status }: { status: Provider['verification'] }) => {
    const styles = {
        Verified: 'text-green-600',
        Pending: 'text-yellow-600',
        Rejected: 'text-red-600',
    };
    const icons = {
        Verified: <CheckCircleIcon className="h-5 w-5" />,
        Pending: <ClockIcon className="h-5 w-5" />,
        Rejected: <XCircleIcon className="h-5 w-5" />,
    };
    return (
        <div className={`flex items-center space-x-2 ${styles[status]}`}>
            {icons[status]}
            <span>{status}</span>
        </div>
    );
};

const AvailabilityToggle = ({ status, onChange }: { status: Provider['availability'], onChange: () => void }) => (
    <button 
        onClick={onChange}
        className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
        {status}
    </button>
);

const Rating = ({ rating }: { rating: number }) => (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className={`h-4 w-4 ${i < Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.368-2.448a1 1 0 00-1.175 0l-3.368 2.448c-.784.57-1.838-.197-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" /></svg>
      ))}
      <span className="ml-1 text-xs text-gray-600">({rating.toFixed(1)})</span>
    </div>
);

// --- MAIN PAGE COMPONENT ---

export default function ProvidersPage() {
    const [providers, setProviders] = useState<Provider[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState<{ key: keyof Provider; direction: 'asc' | 'desc' } | null>(null);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(firestore, "providers"), (snapshot) => {
            const newProviders = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Provider));
            setProviders(newProviders);
        });

        return () => unsubscribe();
    }, []);

    const handleAvailabilityToggle = async (id: string, currentStatus: Provider['availability']) => {
        const newStatus = currentStatus === 'Available' ? 'Unavailable' : 'Available';
        const providerRef = doc(firestore, "providers", id);
        await updateDoc(providerRef, { availability: newStatus });
    };

    const filteredAndSortedProviders = useMemo(() => {
        let sortedProviders = [...providers];

        if (sortConfig !== null) {
            sortedProviders.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }

        return sortedProviders.filter(provider =>
            provider.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            provider.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            provider.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [providers, searchTerm, sortConfig]);

    const requestSort = (key: keyof Provider) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };
    
    const providerColumns = [
        { key: 'businessName', label: 'Business Name', sortable: true },
        { key: 'ownerName', label: 'Owner', sortable: true },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Phone' },
        { key: 'services', label: 'Services' },
        { key: 'rating', label: 'Rating', sortable: true },
        { key: 'jobsCompleted', label: 'Jobs Completed', sortable: true },
        { key: 'verification', label: 'Verification' },
        { key: 'availability', label: 'Availability' },
        { key: 'memberSince', label: 'Member Since', sortable: true },
        { key: 'actions', label: 'Actions' }
    ];

    const renderCell = (provider: Provider, key: string) => {
        const cellValue = provider[key as keyof Provider];

        switch (key) {
            case 'services':
                return (
                    <div className="flex flex-wrap gap-1">
                        {(cellValue as string[]).map(service => (
                            <span key={service} className="px-2 py-1 bg-gray-200 text-gray-800 rounded-md text-xs">{service}</span>
                        ))}
                    </div>
                );
            case 'rating':
                return <Rating rating={cellValue as number} />;
            case 'verification':
                return <VerificationStatus status={cellValue as Provider['verification']} />;
            case 'availability':
                return <AvailabilityToggle status={cellValue as Provider['availability']} onChange={() => handleAvailabilityToggle(provider.id, cellValue as Provider['availability'])} />;
            case 'memberSince':
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
                <h1 className="text-3xl font-bold text-gray-800">Provider Management</h1>
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ease-in-out flex items-center">
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Add Provider
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
                            placeholder="Search by business, owner, or email..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {providerColumns.map((col) => (
                                    <th 
                                        key={col.key} 
                                        scope="col" 
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        onClick={() => col.sortable && requestSort(col.key as keyof Provider)}
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
                            {filteredAndSortedProviders.map((provider) => (
                                <tr key={provider.id} className="hover:bg-gray-50 transition-colors">
                                    {providerColumns.map(col => (
                                        <td key={col.key} className="px-6 py-4 whitespace-nowrap">
                                            {renderCell(provider, col.key)}
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
