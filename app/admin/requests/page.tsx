'use client'
import React, { useState, useMemo, useEffect } from "react"
import { CheckIcon, XMarkIcon, ChevronUpIcon, ChevronDownIcon, MagnifyingGlassIcon, ArchiveBoxXMarkIcon } from "@heroicons/react/24/solid"
import { firestore } from "../../firebase/client";
import { collection, onSnapshot, doc, updateDoc, getDocs, query, where } from "firebase/firestore";

// --- TYPES ---

type ServiceRequest = {
    id: string;
    name: string;
    email: string;
    phone: string;
    date: string;
    service: string;
    status: 'Pending' | 'Approved' | 'Rejected' | 'Closed';
    createdAt: any; // Firestore timestamp
    providerResponses: number;
};

// --- HELPER COMPONENTS ---

const StatusBadge = ({ status }: { status: ServiceRequest['status'] }) => {
    const styles = {
        Pending: 'bg-yellow-100 text-yellow-800',
        Approved: 'bg-green-100 text-green-800',
        Rejected: 'bg-red-100 text-red-800',
        Closed: 'bg-gray-100 text-gray-800',
    };
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>{status}</span>;
};

// --- MAIN PAGE COMPONENT ---

export default function RequestsPage() {
    const [requests, setRequests] = useState<ServiceRequest[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState<{ key: keyof ServiceRequest; direction: 'asc' | 'desc' } | null>(null);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(firestore, "serviceRequests"), (snapshot) => {
            const newRequests = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                providerResponses: doc.data().providerResponses || 0, // Default to 0 if not present
            } as ServiceRequest));

            newRequests.forEach(request => {
                if (request.providerResponses >= 5 && request.status !== 'Closed') {
                    handleStatusChange(request.id, 'Closed');
                }
            });

            setRequests(newRequests);
        });

        return () => unsubscribe();
    }, []);

    const handleStatusChange = async (id: string, newStatus: ServiceRequest['status']) => {
        const requestRef = doc(firestore, "serviceRequests", id);
        await updateDoc(requestRef, { status: newStatus });
    };

    const filteredAndSortedRequests = useMemo(() => {
        let sortedRequests = [...requests];

        if (sortConfig !== null) {
            sortedRequests.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }

        return sortedRequests.filter(request =>
            request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.service.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [requests, searchTerm, sortConfig]);

    const requestSort = (key: keyof ServiceRequest) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };
    
    const requestColumns = [
        { key: 'name', label: 'Customer Name', sortable: true },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Phone' },
        { key: 'service', label: 'Service Request' },
        { key: 'status', label: 'Status', sortable: true },
        { key: 'providerResponses', label: 'Responses', sortable: true },
        { key: 'createdAt', label: 'Received', sortable: true },
        { key: 'actions', label: 'Actions' }
    ];

    const renderCell = (request: ServiceRequest, key: string) => {
        const cellValue = request[key as keyof ServiceRequest];
        const isClosed = request.status === 'Closed' || request.status === 'Approved' || request.status === 'Rejected';

        switch (key) {
            case 'status':
                return <StatusBadge status={cellValue as ServiceRequest['status']} />;
            case 'createdAt':
                return <span className="text-sm text-gray-600">{new Date((cellValue as any).seconds * 1000).toLocaleString()}</span>;
            case 'providerResponses':
                 return <span className="text-sm text-gray-600">{request.providerResponses}</span>;
             case 'actions':
                return (
                    <div className="flex items-center space-x-2">
                        <button onClick={() => handleStatusChange(request.id, 'Approved')} disabled={isClosed} className={`p-2 text-green-600 rounded-full transition-colors ${isClosed ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-100'}`}><CheckIcon className="h-5 w-5" /></button>
                        <button onClick={() => handleStatusChange(request.id, 'Rejected')} disabled={isClosed} className={`p-2 text-red-600 rounded-full transition-colors ${isClosed ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-100'}`}><XMarkIcon className="h-5 w-5" /></button>
                        <button onClick={() => handleStatusChange(request.id, 'Closed')} disabled={isClosed} className={`p-2 text-gray-600 rounded-full transition-colors ${isClosed ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}><ArchiveBoxXMarkIcon className="h-5 w-5" /></button>
                    </div>
                );
            default:
                return <span className="text-sm text-gray-600">{String(cellValue)}</span>;
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Service Requests</h1>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                    <div className="relative w-full max-w-md">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by name, email, or service..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {requestColumns.map((col) => (
                                    <th 
                                        key={col.key} 
                                        scope="col" 
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        onClick={() => col.sortable && requestSort(col.key as keyof ServiceRequest)}
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
                            {filteredAndSortedRequests.map((request) => (
                                <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                                    {requestColumns.map(col => (
                                        <td key={col.key} className="px-6 py-4 whitespace-nowrap">
                                            {renderCell(request, col.key)}
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
