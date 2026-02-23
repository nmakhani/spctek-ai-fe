"use client";

import { useState, useEffect } from "react";
import { useFetch } from "@/hooks/useFetch";

interface User {
  id: number;
  email: string;
  username: string;
  is_active: boolean;
  created_at: string;
}

export default function UsersPage() {
  const { data: users, loading, error } = useFetch("/users");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ email: "", username: "", password: "" });

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      
      if (response.ok) {
        setFormData({ email: "", username: "", password: "" });
        setShowForm(false);
        window.location.reload();
      }
    } catch (err) {
      console.error("Failed to create user", err);
    }
  };

  return (
    <div className="py-16">
      <div className="text-white">
        <h1 className="text-4xl font-bold mb-8">User Management</h1>

        <div className="mb-8">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-semibold"
          >
            {showForm ? "Cancel" : "Add New User"}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleCreateUser} className="bg-slate-800 p-6 rounded-lg mb-8 max-w-md">
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2 rounded bg-slate-700 text-white"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Username</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full p-2 rounded bg-slate-700 text-white"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full p-2 rounded bg-slate-700 text-white"
                required
              />
            </div>
            <button type="submit" className="w-full bg-green-600 hover:bg-green-700 py-2 rounded font-semibold">
              Create User
            </button>
          </form>
        )}

        <div className="bg-slate-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6">Users</h2>
          
          {loading && <p className="text-gray-300">Loading users...</p>}
          {error && <p className="text-red-400">Error: {error}</p>}
          
          {users && Array.isArray(users) && users.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-gray-300">
                <thead className="border-b border-slate-700">
                  <tr>
                    <th className="pb-4">ID</th>
                    <th className="pb-4">Email</th>
                    <th className="pb-4">Username</th>
                    <th className="pb-4">Status</th>
                    <th className="pb-4">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user: User) => (
                    <tr key={user.id} className="border-b border-slate-700 hover:bg-slate-700">
                      <td className="py-4">{user.id}</td>
                      <td className="py-4">{user.email}</td>
                      <td className="py-4">{user.username}</td>
                      <td className="py-4">
                        <span className={user.is_active ? "text-green-400" : "text-red-400"}>
                          {user.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="py-4">{new Date(user.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-400">No users found</p>
          )}
        </div>
      </div>
    </div>
  );
}
