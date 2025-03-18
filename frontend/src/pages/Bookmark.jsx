import Navbar from "../components/Navbar";
import ContestCard from "../components/contest-card";
import Footer from "../components/Footer";
import { useContests } from "../hooks/use-contests";
import { useBookmarks } from "../context/BookmarkContext";

export default function BookmarksPage() {
  const { contests, loading } = useContests();
  const { bookmarkedContests, toggleBookmark, removeAllBookmarks } = useBookmarks();

  const filteredContests = contests.filter((contest) => bookmarkedContests.includes(contest._id));

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 pt-24 pb-16 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-neutral-950">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 pt-24 pb-16">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Bookmarked Contests
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Your saved coding contests</p>
          </div>
          {filteredContests.length > 0 && (
            <button
              onClick={() => removeAllBookmarks()}
              className="ml-4 px-4 py-2 text-sm font-medium text-red-600 border border-red-600 rounded-md hover:bg-red-600 hover:text-white transition-colors"
            >
              Clear All
            </button>
          )}
        </header>

        {filteredContests.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No bookmarked contests</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">You haven’t bookmarked any contests yet</p>
            <a href="/" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 transition-colors shadow-md">
              Browse contests
            </a>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {filteredContests.map((contest) => (
              <ContestCard key={contest._id} contest={contest} isBookmarked={true} toggleBookmark={toggleBookmark} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
