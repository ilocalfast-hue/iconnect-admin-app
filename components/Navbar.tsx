'use client'

import Link from 'next/link'

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-2xl font-bold">
          iConnect Admin
        </Link>
        <div className="flex space-x-4">
          <Link href="/admin/users" className="text-gray-300 hover:text-white">Users</Link>
          <Link href="/admin/services" className="text-gray-300 hover:text-white">Services</Link>
          <Link href="/admin/leads" className="text-gray-300 hover:text-white">Leads</Link>
          <Link href="/admin/jobs" className="text-gray-300 hover:text-white">Jobs</Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
