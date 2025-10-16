'use client'
import React, { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { firestore } from '../firebase/client';
import { ArrowRightIcon, BriefcaseIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

// --- TYPES ---
type Job = {
    id: string;
    serviceName: string;
    customerName: string;
    status: 'Pending' | 'Accepted' | 'Completed' | 'Cancelled';
    createdAt: any;
};

type User = {
    id: string;
    name: string;
    email: string;
    createdAt: any;
};

// --- HELPER COMPONENTS ---

const StatCard = ({ title, value, icon, bgColor }: { title: string, value: string | number, icon: React.ReactNode, bgColor: string }) => (
    <div className={`p-6 rounded-2xl shadow-lg flex items-center justify-between ${bgColor}`}>
        <div>
            <p className="text-sm font-medium text-white/80">{title}</p>
            <p className="text-3xl font-bold text-white">{value}</p>
        </div>
        <div className="text-white/50">
            {icon}
        </div>
    </div>
);

const RecentActivityList = ({ title, items, renderItem, viewAllLink }: { title: string, items: any[], renderItem: (item: any) => React.ReactNode, viewAllLink: string }) => (
    <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">{title}</h2>
            <Link href={viewAllLink} className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center">
                View all <ArrowRightIcon className="w-4 h-4 ml-1" />
            </Link>
        </div>
        <ul className="divide-y divide-gray-200">
            {items.map(renderItem)}
        </ul>
    </div>
);

// --- MAIN PAGE COMPONENT ---

export default function AdminDashboardPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [jobs, setJobs] = useState<Job[]>([]);

    useEffect(() => {
        const usersUnsubscribe = onSnapshot(collection(firestore, "users"), (snapshot) => {
            const newUsers = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as User)).sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);
            setUsers(newUsers);
        });

        const jobsUnsubscribe = onSnapshot(collection(firestore, "jobs"), (snapshot) => {
            const newJobs = snapshot.docs.map(doc => ({
                id: doc.id,
                status: 'Pending',
                ...doc.data()
            } as Job)).sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);
            setJobs(newJobs);
        });

        return () => {
            usersUnsubscribe();
            jobsUnsubscribe();
        };
    }, []);

    const pendingJobsCount = jobs.filter(job => job.status === 'Pending').length;

    return (
        <div className="min-h-screen bg-gray-50/50 p-4 sm:p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Dashboard</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <StatCard title="Total Users" value={users.length} icon={<UserGroupIcon className="w-10 h-10" />} bgColor="bg-blue-500" />
                    <StatCard title="Total Jobs" value={jobs.length} icon={<BriefcaseIcon className="w-10 h-10" />} bgColor="bg-purple-500" />
                    <StatCard title="Pending Jobs" value={pendingJobsCount} icon={<BriefcaseIcon className="w-10 h-10" />} bgColor="bg-yellow-500" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <RecentActivityList
                        title="Recent Jobs"
                        items={jobs.slice(0, 5)}
                        viewAllLink="/admin/jobs"
                        renderItem={(job: Job) => (
                            <li key={job.id} className="py-3 flex justify-between items-center">
                                <div>
                                    <p className="font-semibold text-gray-800">{job.serviceName}</p>
                                    <p className="text-sm text-gray-500">{job.customerName}</p>
                                </div>
                                <span className={`px-3 py-1 text-xs font-semibold rounded-full bg-${job.status === 'Pending' ? 'yellow' : 'green'}-100 text-${job.status === 'Pending' ? 'yellow' : 'green'}-800`}>
                                    {job.status}
                                </span>
                            </li>
                        )}
                    />
                    <RecentActivityList
                        title="Recent Users"
                        items={users.slice(0, 5)}
                        viewAllLink="/admin/users"
                        renderItem={(user: User) => (
                            <li key={user.id} className="py-3 flex justify-between items-center">
                                <div>
                                    <p className="font-semibold text-gray-800">{user.name}</p>
                                    <p className="text-sm text-gray-500">{user.email}</p>
                                </div>
                                <span className="text-sm text-gray-500">
                                    {new Date(user.createdAt.seconds * 1000).toLocaleDateString()}
                                </span>
                            </li>
                        )}
                    />
                </div>
            </div>
        </div>
    );
}
