'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '@/app/firebase';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'User' });
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = await getDocs(collection(db, 'users'));
      setUsers(usersCollection.docs.map(doc => ({ id: doc.id, ...doc.data() } as User)));
    };
    fetchUsers();
  }, []);

  const handleAddUser = async () => {
    if (newUser.name && newUser.email) {
      const docRef = await addDoc(collection(db, 'users'), newUser);
      setUsers([...users, { id: docRef.id, ...newUser }]);
      setNewUser({ name: '', email: '', role: 'User' });
      setIsAddModalOpen(false);
    }
  };

  const handleEditUser = async () => {
    if (editingUser) {
      await setDoc(doc(db, 'users', editingUser.id), { 
        name: editingUser.name, 
        email: editingUser.email, 
        role: editingUser.role 
      });
      setUsers(users.map(user => user.id === editingUser.id ? editingUser : user));
      setEditingUser(null);
      setIsEditModalOpen(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    await deleteDoc(doc(db, 'users', userId));
    setUsers(users.filter(user => user.id !== userId));
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setIsEditModalOpen(true);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900">Users</h1>
      <p className="mt-4 text-lg text-gray-600">Manage all users of the platform.</p>
      <div className="mt-8">
        <div className="flex justify-end">
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">
            Add User
          </button>
        </div>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full whitespace-nowrap">
            <thead className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y">
              {users.map((user) => (
                <tr key={user.id} className="text-gray-700">
                  <td className="px-4 py-3">
                    <div className="flex items-center text-sm">
                      <div>
                        <p className="font-semibold">{user.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">{user.email}</td>
                  <td className="px-4 py-3 text-xs">
                    <span
                      className={`px-2 py-1 font-semibold leading-tight ${
                        user.role === 'Admin'
                          ? 'text-green-700 bg-green-100'
                          : 'text-gray-700 bg-gray-100'
                      } rounded-full`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <button 
                      onClick={() => openEditModal(user)}
                      className="px-2 py-1 mr-2 text-sm font-medium text-blue-600 border border-transparent rounded-md hover:text-blue-800">
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="px-2 py-1 text-sm font-medium text-red-600 border border-transparent rounded-md hover:text-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 bg-white rounded-md">
            <h2 className="text-2xl font-bold">Add User</h2>
            <div className="mt-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <input 
                  type="text" 
                  id="name" 
                  value={newUser.name} 
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} 
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div className="mt-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  value={newUser.email} 
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} 
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div className="mt-4">
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                <select 
                  id="role" 
                  value={newUser.role} 
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })} 
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option>User</option>
                  <option>Admin</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 mr-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">
                Cancel
              </button>
              <button 
                onClick={handleAddUser}
                className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">
                Add User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {isEditModalOpen && editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 bg-white rounded-md">
            <h2 className="text-2xl font-bold">Edit User</h2>
            <div className="mt-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <input 
                  type="text" 
                  id="name" 
                  value={editingUser.name} 
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })} 
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div className="mt-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  value={editingUser.email} 
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })} 
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div className="mt-4">
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                <select 
                  id="role" 
                  value={editingUser.role} 
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })} 
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option>User</option>
                  <option>Admin</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 mr-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">
                Cancel
              </button>
              <button 
                onClick={handleEditUser}
                className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
