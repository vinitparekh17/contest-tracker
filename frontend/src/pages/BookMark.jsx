import { useState, useEffect } from "react"
import Navbar from "../components/Navbar"
import ContestCard from "../components/contest-card"
import Footer from "../components/Footer"

// Platform badge colors
const platformColors = {
  LeetCode: { bg: "bg-yellow-500", text: "text-black" },
  Codeforces: { bg: "bg-blue-500", text: "text-white" },
  CodeChef: { bg: "bg-green-500", text: "text-white" },
  Google: { bg: "bg-red-500", text: "text-white" },
  HackerRank: { bg: "bg-emerald-500", text: "text-white" },
  AtCoder: { bg: "bg-gray-200", text: "text-black" },
}

export default function BookmarksPage() {
  const [bookmarkedContests, setBookmarkedContests] = useState(() => {
    const saved = localStorage.getItem('bookmarkedContests');
    return saved ? JSON.parse(saved) : [];
  });
  const [contests, setContests] = useState([])
  const [loading, setLoading] = useState(true)

  // Load bookmarked contests from localStorage on initial render
  useEffect(() => {
    const storedBookmarks = localStorage.getItem("bookmarkedContests")
    if (storedBookmarks) {
      try {
        setBookmarkedContests(JSON.parse(storedBookmarks))
        console.log("Bookmarked contests loaded", storedBookmarks)
      } catch (error) {
        console.error("Failed to parse bookmarked contests:", error)
      }
    }

    const fetchContests = async () => {
      const res = await fetch("http://localhost:3000/api/contests")
      const data = await res.json()
      setContests(data)
      setLoading(false)
    }

    fetchContests()
    
  }, [])

  // Save bookmarked contests to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("bookmarkedContests", JSON.stringify(bookmarkedContests))
  }, [bookmarkedContests])

  // Filter contests to only show bookmarked ones
  const filteredContests = contests.filter((contest) => bookmarkedContests.includes(contest._id))

  // Toggle bookmark for a contest
  const toggleBookmark = (contestId) => {
    setBookmarkedContests((prev) =>
      prev.includes(contestId) ? prev.filter((id) => id !== contestId) : [...prev, contestId],
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 pt-24 pb-16">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
<div className="min-h-screen flex flex-col bg-gray-100 dark:bg-neutral-950">
  <Navbar />
  <main className="flex-1 container mx-auto px-4 pt-24 pb-16">
    <header className="mb-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
        Bookmarked Contests
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mt-2">Your saved coding contests</p>
    </header>

    {filteredContests.length === 0 ? (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
          No bookmarked contests
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          You haven’t bookmarked any contests yet
        </p>
        <a
          href="/"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
        >
          Browse contests
        </a>
      </div>
    ) : (
      <div className="grid gap-6 md:grid-cols-2">
        {filteredContests.map((contest) => (
          <ContestCard
            key={contest._id}
            contest={contest}
            isBookmarked={true}
            toggleBookmark={toggleBookmark}
            platformColors={platformColors}
          />
        ))}
      </div>
    )}
  </main>
  <Footer />
</div>
  )
}