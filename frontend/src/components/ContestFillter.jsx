export default function ContestFilter({
  platforms,
  selectedPlatforms,
  onFilterChange
}) {
  const platformColors = {
    leetcode: { bg: "bg-yellow-500", text: "text-black" },
    codeforces: { bg: "bg-blue-500", text: "text-white" },
    codechef: { bg: "bg-green-500", text: "text-white" }
  }

  // Toggle platform selection
  const togglePlatform = (platform) => {
    const newSelection = selectedPlatforms.includes(platform)
      ? selectedPlatforms.filter((p) => p !== platform)
      : [...selectedPlatforms, platform]

    onFilterChange(newSelection)
  }

  // Clear all filters
  const clearFilters = () => {
    onFilterChange([])
  }

  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 sm:mb-0">
          Upcoming Contests
        </h2>

        {selectedPlatforms.length > 0 && (
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-2">
        <span className="text-sm text-gray-500 dark:text-gray-400 self-center mr-1">
          Filter by platform:
        </span>
        {platforms.map((platform) => (
          <button
            key={platform}
            onClick={() => togglePlatform(platform)}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${selectedPlatforms.includes(platform)
                ? `${platformColors[platform]?.bg || "bg-gray-600"} ${platformColors[platform]?.text || "text-white"}`
                : "bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
          >
            {platform}
            {selectedPlatforms.includes(platform) && <span className="ml-1">✓</span>}
          </button>
        ))}
      </div>

      {selectedPlatforms.length > 0 && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Filtering by {selectedPlatforms.join(", ")}
        </p>
      )}
    </div>
  )
}