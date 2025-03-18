export const formatDate = (date) => {
    try {
        const dateObj = new Date(date);

        if (isNaN(dateObj.getTime())) {
            return "Invalid Date"; // If parsing fails
        }

        return new Intl.DateTimeFormat("en-US", {
            weekday: "short",  // "Sat"
            month: "short",    // "Mar"
            day: "2-digit",    // "22"
            year: "numeric",   // "2025"
            hour: "2-digit",   // "02"
            minute: "2-digit", // "35"
            hour12: false,     // 24-hour format
            timeZone: "UTC",   // Ensure UTC consistency
        }).format(dateObj);
    } catch (error) {
        console.error("Error formatting date:", error);
        return "Invalid Date";
    }
};


export const formatTimeDistance = (date) => {
    // Input validation
    if (!(date instanceof Date) || isNaN(date.getTime())) return "Invalid date";
  
    const now = new Date();
    const diffMs = date - now; // Difference in milliseconds
    const isInPast = diffMs <= 0;
    const absDiffMs = Math.abs(diffMs);
  
    // Time unit definitions (in milliseconds) and their labels
    const units = [
      { ms: 1000 * 60 * 60 * 24, singular: "day", threshold: 1 },
      { ms: 1000 * 60 * 60, singular: "hour", threshold: 24 },
      { ms: 1000 * 60, singular: "minute", threshold: 60 },
    ];
  
    // Helper function for pluralization
    const pluralize = (value, singular) => `${value} ${singular}${value !== 1 ? "s" : ""}`;
  
    // Calculate and format the largest applicable time unit
    for (const { ms, singular, threshold } of units) {
      const value = Math.floor(absDiffMs / ms);
      if (value >= threshold) {
        return isInPast
          ? `Finished ${pluralize(value, singular)} ago`
          : `Starts in ${pluralize(value, singular)}`;
      }
    }
  
    // Fallback for small differences
    return isInPast ? "Finished just now" : "Starting soon";
  };