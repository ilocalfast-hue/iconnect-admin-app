'use client';

import { useAuth } from '../hooks/useAuth';
import { auth } from '../../lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function Header() {
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    Cookies.remove('idToken');
    router.push('/');
  };

  return (
    <header className="flex items-center justify-between p-6 bg-white shadow-md rounded-lg mx-4 mt-4">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Welcome, {user?.displayName}</h2>
      </div>
      <div>
        <button onClick={handleLogout} className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out">
          Logout
        </button>
      </div>
    </header>
  );
}
