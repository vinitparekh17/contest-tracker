import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Select from 'react-select';

export default function AdminPanel() {
  // Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminCredentials, setAdminCredentials] = useState({ username: '', password: '' });

  // Contest selection and solution
  const [contests, setContests] = useState([]);
  const [selectedContestId, setSelectedContestId] = useState(null);
  const [solutionLink, setSolutionLink] = useState('');

  // Feedback message
  const [message, setMessage] = useState('');

  /** Handle form input changes */
  const handleInputChange = (e) => {
    setAdminCredentials((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  /** Handle login submission */
  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await fetch('http://localhost:3000/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adminCredentials),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Login failed');
      }

      setIsLoggedIn(true);
      setMessage('Logged in successfully!');
    } catch (error) {
      setMessage(error.message);
    }
  };

  /** Fetch contests after login */
  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchContests = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/contests/without-solution');
        const data = await res.json();
        setContests(data);
      } catch (error) {
        console.error('Failed to load contests:', error);
        setMessage('Failed to load contests');
      }
    };

    fetchContests();
  }, [isLoggedIn]);

  useEffect(() => {
    if (message) {
      const timeout = setTimeout(() => setMessage(''), 5000);
      return () => clearTimeout(timeout);
    }
  }, [message]);
  

  /** Handle solution submission */
  const handleSubmitSolution = async (e) => {
    e.preventDefault();
    if (!selectedContestId) return setMessage('Please select a contest');

    try {
      const response = await fetch(`http://localhost:3000/api/contests/${selectedContestId}/solution`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ solutionLink, ...adminCredentials }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to add solution');
      }

      setMessage('Solution added successfully!');
      setSelectedContestId(null);
      setSolutionLink('');
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-neutral-950 flex items-center justify-center px-4">
    <Navbar />
      <div className="w-full max-w-md p-6 bg-white dark:bg-neutral-800 rounded-lg shadow-md dark:shadow-neutral-700 dark:shadow-lg">
        {!isLoggedIn ? (
          <>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">Admin Login</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              {['username', 'password'].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    {`Admin ${field.charAt(0).toUpperCase() + field.slice(1)}`}
                  </label>
                  <input
                    type={field === 'password' ? 'password' : 'text'}
                    name={field}
                    value={adminCredentials[field]}
                    onChange={handleInputChange}
                    className="mt-1 w-full px-3 py-2 bg-gray-50 dark:bg-neutral-700 border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              ))}
              <button
                type="submit"
                className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
              >
                Login
              </button>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Add Solution Link</h2>
            <form onSubmit={handleSubmitSolution} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Select Contest</label>
                <Select
                  options={contests.map((c) => ({ value: c._id, label: c.title }))}
                  onChange={(option) => setSelectedContestId(option.value)}
                  placeholder="Choose a contest"
                  isSearchable
                  className="mt-1"
                />
              </div>
              {selectedContestId && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">YouTube Solution Link</label>
                  <input
                    type="url"
                    value={solutionLink}
                    onChange={(e) => setSolutionLink(e.target.value)}
                    className="mt-1 w-full px-3 py-2 bg-gray-50 dark:bg-neutral-700 border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., https://youtube.com/watch?v=abc123"
                    required
                  />
                </div>
              )}
              <button
                type="submit"
                disabled={!selectedContestId}
                className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
              >
                Add Solution
              </button>
            </form>
          </>
        )}
        {message && (
          <p className={`mt-4 text-sm ${message.includes('success') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
