'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/client'; // Adjust this path if needed

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const [user, loading, error] = useAuthState(auth);
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        if (loading) {
            // You might want to show a loading spinner here
            return;
        }
        if (!user) {
            router.push('/admin/login');
        } else {
            setIsLoggedIn(true);
        }
    }, [user, loading, router]);

    if (loading || !isLoggedIn) {
        // You can return a loader or a blank screen while checking auth
        return <div>Loading...</div>; // Or a more sophisticated loading component
    }

    return <>{children}</>;
}
