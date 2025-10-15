"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { name: 'Users', href: '/admin/users' },
  { name: 'Providers', href: '/admin/providers' },
  { name: 'Services', href: '/admin/services' },
  { name: 'Leads', href: '/admin/leads' },
  { name: 'Jobs', href: '/admin/jobs' },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white font-bold text-lg">
          <Link href="/">iConnect</Link>
        </div>
        <div className="flex items-center">
          {links.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link key={link.name} href={link.href} className={`px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>
                {link.name}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
