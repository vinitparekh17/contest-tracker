import { createContext, useContext, useEffect, useState } from "react";

const BookmarkContext = createContext();

export function BookmarkProvider({ children }) {
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

  const removeAllBookmarks = () => {
    setBookmarkedContests([]);
    localStorage.removeItem("bookmarkedContests");
  };

  const isBookmarked = (contestId) => bookmarkedContests.includes(contestId);

  return (
    <BookmarkContext.Provider value={{ bookmarkedContests, toggleBookmark, isBookmarked, removeAllBookmarks }}>
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmarks() {
  return useContext(BookmarkContext);
}
