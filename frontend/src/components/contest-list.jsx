import { useState, useMemo } from "react";
import ContestCard from "./contest-card";
import ContestFilter from "./ContestFillter";
import SkeletonContestCard from "./skeleton-card";
import { formatDate, formatTimeDistance } from "../utils/time-formater";
import { useContests } from "../hooks/use-contests";
import { useBookmarks } from "../context/BookmarkContext";

export default function ContestList() {
  const { contests, loading } = useContests();
  const { toggleBookmark, isBookmarked } = useBookmarks();
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);

  const platforms = ["leetcode", "codeforces", "codechef"];

  const filteredContests = useMemo(
    () =>
      selectedPlatforms.length > 0
        ? contests.filter((contest) => selectedPlatforms.includes(contest.platform))
        : contests,
    [contests, selectedPlatforms]
  );

  const handleFilterChange = (platforms) => setSelectedPlatforms(platforms);

  if (loading) {
    return Array.from({ length: 6 }).map((_, i) => <SkeletonContestCard key={i} />);
  }

  return (
    <div>
      <ContestFilter platforms={platforms} selectedPlatforms={selectedPlatforms} onFilterChange={handleFilterChange} />
      <div className="grid gap-6 md:grid-cols-2">
        {filteredContests.map((contest) => (
          <ContestCard
            key={contest._id}
            contest={contest}
            formatedDate={formatDate(contest.startTime)}
            timeRemaining={formatTimeDistance(new Date(contest.startTime))}
            isBookmarked={isBookmarked(contest._id)}
            toggleBookmark={toggleBookmark}
          />
        ))}
      </div>
    </div>
  );
}
