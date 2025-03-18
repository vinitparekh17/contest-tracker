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
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (diffDays > 0) {
        return `Starts in ${diffDays} day${diffDays !== 1 ? 's' : ''}`;
    } else if (diffHours > 0) {
        return `Starts in ${diffHours} hour${diffHours !== 1 ? 's' : ''}`;
    } else {
        return 'Starting soon';
    }
};