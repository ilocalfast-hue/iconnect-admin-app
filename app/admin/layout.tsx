'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AuthGuard from './auth-guard'; // Assuming auth-guard.tsx is in the same directory

const navLinks = [
  { href: '/admin/requests', label: 'Requests' },
  { href: '/admin/providers', label: 'Providers' },
  { href: '/admin/services', label: 'Services' },
  { href: '/admin/users', label: 'Users' },
  { href: '/admin/jobs', label: 'Jobs' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Don't apply AuthGuard to the login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-gray-100">
        <aside className="w-64 bg-white shadow-md">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800">Admin</h1>
          </div>
          <nav className="mt-6">
            <ul>
              {navLinks.map((link) => {
                const isActive = pathname.startsWith(link.href);
                return (
                  <li key={link.href}>
                    <Link href={link.href} className={`block px-6 py-3 text-lg ${isActive ? 'bg-gray-200 text-gray-800' : 'text-gray-600 hover:bg-gray-100'}`}>
                        {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}
