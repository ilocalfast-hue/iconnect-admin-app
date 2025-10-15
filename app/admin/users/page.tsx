'use client'
import React, { useState, useMemo, useEffect } from "react"
import { PlusIcon, PencilIcon, TrashIcon, ChevronUpIcon, ChevronDownIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid"
import { firestore } from "../../firebase/client";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";

// --- TYPES ---

type User = {
    id: string;
    name: string;
    email: string;
    phone: string;
    status: 'Active' | 'Pending' | 'Banned';
    lastLogin: any; // Firestore timestamp
    createdAt: any; // Firestore timestamp
};

// --- HELPER COMPONENTS ---

const StatusBadge = ({ status, onStatusChange }: { status: User['status'], onStatusChange: (newStatus: User['status']) => void }) => {
    const styles = {
        Active: 'bg-green-100 text-green-800',
        Pending: 'bg-yellow-100 text-yellow-800',
        Banned: 'bg-red-100 text-red-800',
    };

    const [isOpen, setIsOpen] = useState(false);

    const handleStatusSelect = (newStatus: User['status']) => {
        onStatusChange(newStatus);
        setIsOpen(false);
    }

    return (
        <div className="relative">
            <button onClick={() => setIsOpen(!isOpen)} className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>{status}</button>
            {isOpen && (
                <div className="absolute z-10 mt-2 w-32 bg-white rounded-md shadow-lg">
                    <button onClick={() => handleStatusSelect('Active')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Active</button>
                    <button onClick={() => handleStatusSelect('Pending')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Pending</button>
                    <button onClick={() => handleStatusSelect('Banned')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Banned</button>
                </div>
            )}
        </div>
    );
}

// --- MAIN PAGE COMPONENT ---

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState<{ key: keyof User; direction: 'asc' | 'desc' } | null>(null);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(firestore, "users"), (snapshot) => {
            const newUsers = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as User));
            setUsers(newUsers);
        });

        return () => unsubscribe();
    }, []);

    const handleStatusChange = async (userId: string, newStatus: User['status']) => {
        const userRef = doc(firestore, "users", userId);
        await updateDoc(userRef, { status: newStatus });
    };

    const filteredAndSortedUsers = useMemo(() => {
        let sortedUsers = [...users];

        if (sortConfig !== null) {
            sortedUsers.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }

        return sortedUsers.filter(user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [users, searchTerm, sortConfig]);

    const requestSort = (key: keyof User) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };
    
    const userColumns = [
        { key: 'name', label: 'Name', sortable: true },
        { key: 'email', label: 'Email', sortable: true },
        { key: 'phone', label: 'Phone' },
        { key: 'status', label: 'Status' },
        { key: 'lastLogin', label: 'Last Login', sortable: true },
        { key: 'createdAt', label: 'Joined', sortable: true },
        { key: 'actions', label: 'Actions' }
    ];

    return (
        <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ease-in-out flex items-center">
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Add User
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
                            placeholder="Search by name or email..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {userColumns.map((col) => (
                                    <th 
                                        key={col.key} 
                                        scope="col" 
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        onClick={() => col.sortable && requestSort(col.key as keyof User)}
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
                            {filteredAndSortedUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.phone}</td>
                                    <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={user.status} onStatusChange={(newStatus) => handleStatusChange(user.id, newStatus)} /></td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{new Date((user.lastLogin as any).seconds * 1000).toLocaleString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{new Date((user.createdAt as any).seconds * 1000).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex items-center space-x-3">
                                            <button className="text-blue-600 hover:text-blue-900"><PencilIcon className="h-5 w-5" /></button>
                                            <button className="text-red-600 hover:text-red-900"><TrashIcon className="h-5 w-5" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
