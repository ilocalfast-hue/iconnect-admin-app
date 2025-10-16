'use client'
import React, { useState, useMemo, useEffect } from "react"
import { PlusIcon, PencilIcon, TrashIcon, ChevronUpIcon, ChevronDownIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid"
import { firestore } from "../../firebase/client";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";

// --- TYPES ---

type Job = {
    id: string;
    serviceName: string;
    customerName: string;
    providerName: string;
    scheduledTime: any; // Firestore timestamp
    review: string;
    createdAt: any; // Firestore timestamp
    status: 'Pending' | 'Accepted' | 'Completed' | 'Cancelled';
};

// --- HELPER COMPONENTS ---

const JobStatusBadge = ({ status, onStatusChange }: { status: Job['status'], onStatusChange: (newStatus: Job['status']) => void }) => {
    const styles = {
        Pending: 'bg-yellow-100 text-yellow-800',
        Accepted: 'bg-blue-100 text-blue-800',
        Completed: 'bg-green-100 text-green-800',
        Cancelled: 'bg-red-100 text-red-800',
    };

    const [isOpen, setIsOpen] = useState(false);

    const handleStatusSelect = (newStatus: Job['status']) => {
        onStatusChange(newStatus);
        setIsOpen(false);
    }

    return (
        <div className="relative">
            <button onClick={() => setIsOpen(!isOpen)} className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>{status}</button>
            {isOpen && (
                <div className="absolute z-10 mt-2 w-32 bg-white rounded-md shadow-lg">
                    <button onClick={() => handleStatusSelect('Pending')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Pending</button>
                    <button onClick={() => handleStatusSelect('Accepted')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Accepted</button>
                    <button onClick={() => handleStatusSelect('Completed')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Completed</button>
                    <button onClick={() => handleStatusSelect('Cancelled')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Cancelled</button>
                </div>
            )}
        </div>
    );
}


// --- MAIN PAGE COMPONENT ---

export default function JobsPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState<{ key: keyof Job; direction: 'asc' | 'desc' } | null>(null);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(firestore, "jobs"), (snapshot) => {
            const newJobs = snapshot.docs.map(doc => ({
                id: doc.id,
                status: 'Pending', // Default status
                ...doc.data()
            } as Job));
            setJobs(newJobs);
        });

        return () => unsubscribe();
    }, []);

    const handleStatusChange = async (jobId: string, newStatus: Job['status']) => {
        const jobRef = doc(firestore, "jobs", jobId);
        await updateDoc(jobRef, { status: newStatus });
    };

    const filteredAndSortedJobs = useMemo(() => {
        let sortedJobs = [...jobs];

        if (sortConfig !== null) {
            sortedJobs.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }

        return sortedJobs.filter(job =>
            job.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.providerName.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [jobs, searchTerm, sortConfig]);

    const requestSort = (key: keyof Job) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };
    
    const jobColumns = [
        { key: 'serviceName', label: 'Service', sortable: true },
        { key: 'customerName', label: 'Customer', sortable: true },
        { key: 'providerName', label: 'Provider', sortable: true },
        { key: 'status', label: 'Status', sortable: true },
        { key: 'scheduledTime', label: 'Scheduled For', sortable: true },
        { key: 'review', label: 'Review', sortable: false },
        { key: 'createdAt', label: 'Booked On', sortable: true },
        { key: 'actions', label: 'Actions' }
    ];

    const renderCell = (job: Job, key: string) => {
        const cellValue = job[key as keyof Job];

        switch (key) {
            case 'scheduledTime':
            case 'createdAt':
                return <span className="text-sm text-gray-600">{new Date((cellValue as any).seconds * 1000).toLocaleString()}</span>;
            case 'review':
                return <span className="text-sm text-gray-600">{job.review || 'No review yet'}</span>;
            case 'status':
                return <JobStatusBadge status={job.status || 'Pending'} onStatusChange={(newStatus) => handleStatusChange(job.id, newStatus)} />;
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
                <h1 className="text-3xl font-bold text-gray-800">Job Management</h1>
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ease-in-out flex items-center">
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Add Job
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
                            placeholder="Search by service, customer, or provider..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {jobColumns.map((col) => (
                                    <th 
                                        key={col.key} 
                                        scope="col" 
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        onClick={() => col.sortable && requestSort(col.key as keyof Job)}
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
                            {filteredAndSortedJobs.map((job) => (
                                <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                                    {jobColumns.map(col => (
                                        <td key={col.key} className="px-6 py-4 whitespace-nowrap">
                                            {renderCell(job, col.key)}
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
