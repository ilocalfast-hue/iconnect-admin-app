'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const AdminNav = () => {
  const pathname = usePathname();

  const navItems = [
    { href: '/admin/users', label: 'Users' },
    { href: '/admin/services', label: 'Services' },
    { href: '/admin/leads', label: 'Leads' },
    { href: '/admin/jobs', label: 'Jobs' },
    { href: '/admin/credits', label: 'Credits' },
    { href: '/admin/settings', label: 'Settings' },
  ];

  return (
    <nav className="mt-10">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`block px-4 py-2 text-sm ${
            pathname === item.href
              ? 'bg-gray-200 text-gray-900'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
};

export default AdminNav;
