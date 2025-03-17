import { useState, useEffect } from "react"
import ContestCard from "./contest-card"
import ContestFilter from "./ContestFillter"
import SkeletonContestCard from "./skeleton-card"

export default function ContestList() {
  const [viewMode, setViewMode] = useState("grid")
  const [contests, setContests] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedPlatforms, setSelectedPlatforms] = useState([])
  const [bookmarkedContests, setBookmarkedContests] = useState(() => {
    try {
      const saved = localStorage.getItem('bookmarkedContests');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      return [];
    }
  });

  // Get unique platforms from contests
  const platforms = ["leetcode", "codeforces", "codechef"]

  // Load bookmarked contests from localStorage on initial render
  useEffect(() => {
    const storedBookmarks = localStorage.getItem("bookmarkedContests")
    if (storedBookmarks) {
      try {
        setBookmarkedContests(JSON.parse(storedBookmarks))
      } catch (error) {
        console.error("Failed to parse bookmarked contests:", error)
      }
    }
  }, [])

  // Save bookmarked contests to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('bookmarkedContests', JSON.stringify(bookmarkedContests));
  }, [bookmarkedContests]);

  // Simulate API fetch
  useEffect(() => {
    const fetchContests = async () => {
      const res = await fetch("http://localhost:3000/api/contests")
      const data = await res.json()
      setContests(data)
      setLoading(false)
    }

    fetchContests()
  }, [])

  // Filter contests based on selected platforms
  const filteredContests =
    selectedPlatforms.length > 0 ? contests.filter((contest) => selectedPlatforms.includes(contest.platform)) : contests

  // Handle filter change from ContestFilter component
  const handleFilterChange = (platforms) => {
    setSelectedPlatforms(platforms)
  }

  // Toggle bookmark for a contest
  const toggleBookmark = (contestId) => {
    setBookmarkedContests((prev) =>
      prev.includes(contestId)
        ? prev.filter((_id) => _id !== contestId)
        : [...prev, contestId]
    );
  };

  // Check if a contest is bookmarked
  const isBookmarked = (contestId) => bookmarkedContests.includes(contestId)

  if (loading) {
    Array.from({ length: 6 }).map((_, i) => (
      <SkeletonContestCard key={i + 9} />
    ))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        {/* Platform filters */}
        <ContestFilter
          platforms={platforms}
          selectedPlatforms={selectedPlatforms}
          onFilterChange={handleFilterChange}
        />
        {/* View mode toggle */}
        {viewMode === "list" ? (
          <button
            onClick={() => setViewMode("grid")}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400">
            <svg className="h-4 w-4 text-gray-600 dark:text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 3h7v7H3zm11 0h7v7h-7zm-11 11h7v7H3zm11 0h7v7h-7z" />
            </svg>
          </button>
        ) : (
          <button 
          onClick={() => setViewMode("list")}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400">
            <svg className="h-4 w-4 text-gray-600 dark:text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 4h2v2H3zm4 0h14v2H7zm-4 7h2v2H3zm4 0h14v2H7zm-4 7h2v2H3zm4 0h14v2H7z" />
            </svg>
          </button>
        )}
      </div>

      {filteredContests.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <h3 className="text-xl font-medium mb-2">No upcoming contests</h3>
          <p className="text-gray-500 mb-4">
            {selectedPlatforms.length > 0
              ? `No contests found for ${selectedPlatforms.join(", ")}`
              : "Check back later for new coding contests"}
          </p>
          {selectedPlatforms.length > 0 && (
            <button
              onClick={() => handleFilterChange([])}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        viewMode === "grid" ? (
          <div className="grid gap-6 md:grid-cols-2">
            {filteredContests.map((contest) => (
              <ContestCard key={contest._id} contest={contest} isBookmarked={isBookmarked(contest._id)} toggleBookmark={toggleBookmark} />
            ))}
          </div>
        ) : (
          <div className="space-y-4 max-w-2xl mx-auto">
            {filteredContests.map((contest) => (
              <ContestCard key={contest._id} contest={contest} isBookmarked={isBookmarked(contest._id)} toggleBookmark={toggleBookmark} />
            ))}
          </div>
        )
      )}
    </div>
  )
}