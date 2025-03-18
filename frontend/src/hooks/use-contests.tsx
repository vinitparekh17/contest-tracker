import { useState, useEffect, useMemo } from "react";

export function useContests() {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/contests");
        const data = await res.json();
        setContests(data);
      } catch (error) {
        console.error("Error fetching contests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContests();
  }, []);

  return { contests, loading };
}

export function useBookmarks() {
  const [bookmarkedContests, setBookmarkedContests] = useState(() => {
    try {
      const saved = localStorage.getItem("bookmarkedContests");
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("bookmarkedContests", JSON.stringify(bookmarkedContests));
  }, [bookmarkedContests]);

  const toggleBookmark = (contestId) => {
    setBookmarkedContests((prev) =>
      prev.includes(contestId) ? prev.filter((id) => id !== contestId) : [...prev, contestId]
    );
  };

  const isBookmarked = (contestId) => bookmarkedContests.includes(contestId);

  return { bookmarkedContests, toggleBookmark, isBookmarked };
}
