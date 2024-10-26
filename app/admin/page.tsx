'use client'
import React, { useEffect, useState } from 'react';
import { Trash } from 'lucide-react'; // Adjust import if necessary

interface User {
  id: string;
  name: string;
  email: string;
  subscriptionPlan?: { name: string };
  subscriptionExpiry?: string;
  connectionsMade: number;
}

const AdminPage = () => {
  const [users, setUsers] = useState<User[]>([]); // Initialize users state with User type
  const [loading, setLoading] = useState(true); // Loading state for user fetch
  const [error, setError] = useState<string | null>(null); // Error state

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true); // Start loading
      try {
        const response = await fetch('/api/users'); // Fetch users
        const data = await response.json();

        // Log the fetched data for debugging
        console.log(data);

        if (Array.isArray(data)) {
          setUsers(data); // Set users if data is an array
        } else {
          setError('Unexpected data format'); // Handle unexpected data format
          setUsers([]); // Reset to an empty array if data is not valid
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Error fetching users'); // Set error state
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchUsers();
  }, []);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    };
    return new Intl.DateTimeFormat('en-GB', options).format(new Date(dateString));
  };

  const handleDelete = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch(`/api/users/${userId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
        } else {
          setError('Failed to delete user. Please try again.');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        setError('Error deleting user. Please try again.');
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>

      {loading && <p className="text-center">Loading...</p>} {/* Show loading message */}
      {error && <p className="text-red-500 text-center">{error}</p>} {/* Show error message */}

      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-4 border-b text-center">Name</th>
            <th className="p-4 border-b text-center">Email</th>
            <th className="p-4 border-b text-center">Subscription Plan</th>
            <th className="p-4 border-b text-center">Plan Deadline</th>
            <th className="p-4 border-b text-center">Connections Made</th>
            <th className="p-4 border-b text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b">
              <td className="p-4 text-center">{user.name}</td>
              <td className="p-4 text-center">{user.email}</td>
              <td className="p-4 text-center">
                {user.subscriptionPlan ? user.subscriptionPlan.name : 'No Plan'}
              </td>
              <td className="p-4 text-center">
                {user.subscriptionExpiry
                  ? formatDate(user.subscriptionExpiry) // Use the custom date formatter
                  : 'N/A'}
              </td>
              <td className="p-4 text-center">{user.connectionsMade}</td>
              <td className="p-4 flex items-center justify-center space-x-2">
                <button 
                  className="text-red-600 hover:underline" 
                  onClick={() => handleDelete(user.id)}>
                  <Trash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPage;
