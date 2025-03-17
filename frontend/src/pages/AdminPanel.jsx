import { useState, useEffect } from 'react';
import Select from 'react-select'; // for a searchable dropdown

export default function AdminPanel() {
  // State for login
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [defaultAdminUser, setDefaultAdminUser] = useState('');
  const [defaultAdminPassword, setDefaultAdminPassword] = useState('');
  // State for contest selector and solution
  const [contests, setContests] = useState([]);
  const [selectedContest, setSelectedContest] = useState(null);
  const [solutionLink, setSolutionLink] = useState('');
  // Feedback message
  const [message, setMessage] = useState('');

  // Handle login submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const response = await fetch('http://localhost:3000/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ defaultAdminUser: defaultAdminUser, defaultAdminPassword: defaultAdminPassword }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Login failed');
      setIsLoggedIn(true);
      setMessage('Logged in successfully!');
    } catch (error) {
      setMessage(error.message);
    }
  };

  // Fetch contests after login
  useEffect(() => {
    if (isLoggedIn) {
      fetch('http://localhost:3000/api/contests/without-solution')
        .then((res) => res.json())
        .then(data => setContests(data))
        .catch(err => {
            console.error('Failed to load contests:', err);
            setMessage('Failed to load contests')
    });
    }
  }, [isLoggedIn]);

  // Handle solution submission
  const handleSubmitSolution = async (e) => {
    e.preventDefault();
    if (!selectedContest) {
      setMessage('Please select a contest');
      return;
    }
    try {
        console.log({
            solutionLink,
            defaultAdminUser: defaultAdminUser,
            defaultAdminPassword: defaultAdminPassword,
          });
      const response = await fetch(`http://localhost:3000/api/contests/${selectedContest._id}/solution`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          solutionLink,
          defaultAdminUser: defaultAdminUser,
          defaultAdminPassword: defaultAdminPassword,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to add solution');
      setMessage('Solution added successfully!');
      setSelectedContest(null);
      setSolutionLink('');
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
        {!isLoggedIn ? (
          <>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              Admin Login
            </h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Admin Username
                </label>
                <input
                  type="text"
                  value={defaultAdminUser}
                  onChange={(e) => setDefaultAdminUser(e.target.value)}
                  className="mt-1 w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Admin Password
                </label>
                <input
                  type="password"
                  value={defaultAdminPassword}
                  onChange={(e) => setDefaultAdminPassword(e.target.value)}
                  className="mt-1 w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
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
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              Add Solution Link
            </h2>
            <form onSubmit={handleSubmitSolution} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Select Contest
                </label>
                <Select
                  options={contests.map((c) => ({ value: c._id, label: c.title }))}
                  onChange={(option) => setSelectedContest(contests.find((c) => c._id === option.value))}
                  placeholder="Choose a contest"
                  isSearchable
                  className="mt-1"
                />
              </div>
              {selectedContest && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    YouTube Solution Link
                  </label>
                  <input
                    type="url"
                    value={solutionLink}
                    onChange={(e) => setSolutionLink(e.target.value)}
                    className="mt-1 w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., https://youtube.com/watch?v=abc123"
                    required
                  />
                </div>
              )}
              <button
                type="submit"
                disabled={!selectedContest}
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
};
