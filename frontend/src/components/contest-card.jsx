export default function ContestCard({ contest, toggleBookmark, isBookmarked }) {

    const platformColors = {
        leetcode: { bg: "bg-yellow-500", text: "text-black" },
        codeforces: { bg: "bg-blue-500", text: "text-white" },
        codechef: { bg: "bg-green-500", text: "text-white" }
    }

    const formatDate = (date) => {
        try {
            const dateString = date.toString();
            // Remove extra newlines and trim spaces
            const cleanedDate = dateString.replace(/\n+/g, " ").trim();

            // Match format like "12 Jun 2024 Wed 20:00"
            const dateRegex = /^(\d{1,2})\s([A-Za-z]{3})\s(\d{4})\s\w+\s(\d{2}):(\d{2})$/;
            const match = cleanedDate.match(dateRegex);

            if (match) {
                const [, day, monthStr, year, hours, minutes] = match;

                // Convert month from string to number
                const monthMap = {
                    Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
                    Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
                };

                const month = monthMap[monthStr];

                if (month === undefined) return null; // Invalid month

                // Create a Date object (UTC)
                const dateObj = new Date(Date.UTC(year, month, day, hours, minutes));

                return dateObj.toISOString(); // Convert to ISO format
            }

            // If it's already a valid date string, return as is
            const parsedDate = new Date(dateString);
            if (!isNaN(parsedDate.getTime())) {
                return parsedDate.toISOString();
            }

            return "invalid-date"; // If parsing fails
        } catch (error) {
            console.error("Error parsing date:", error);
            return "invalid-date";
        }
    };


    const formatTimeDistance = (date) => {
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

    return (
        <div className="overflow-hidden rounded-lg shadow-md transition-shadow duration-300 hover:shadow-lg bg-white dark:bg-neutral-900 dark:hover:bg-gray-800 flex flex-col min-h-full">
            {/* Card Header */}
            <div className="p-4">
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <span
                            className={`${platformColors[contest.platform.toLowerCase()]?.bg || "bg-gray-500"} inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium text-white`}
                        >
                            {contest.platform}
                        </span>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                            {contest.title}
                        </h3>
                    </div>
                    <button
                        onClick={() => toggleBookmark(contest._id)}
                        className="p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300"
                        aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
                    >
                        {isBookmarked ? (
                            <svg className="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z" clipRule="evenodd" />
                            </svg>
                        ) : (
                            <svg className="h-5 w-5 text-gray-400 hover:text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Card Content */}
            <div className="px-4 pb-4 border-b border-gray-200 dark:border-gray-800 flex-grow">
                <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{formatDate(contest.startTime)}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{contest.duration}</span>
                    </div>
                </div>
            </div>

            {/* Card Footer */}
            <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-neutral-800">
                <div className="text-sm text-gray-500 dark:text-gray-300">
                    {formatTimeDistance(contest.startTime)}
                </div>
                <div className="flex space-x-3">
                    {contest.solutionLink && (
                        <a
                            href={contest.solutionLink}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center text-sm font-medium text-red-600 hover:text-red-800 dark:text-red-300 dark:hover:text-red-400 transition-colors"
                            aria-label={`Watch solution for ${contest.title}`}
                        >
                            <svg className="mr-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                            </svg>
                            <span>Solution</span>
                        </a>
                    )}
                    <a
                        href={contest.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-400 transition-colors"
                        aria-label={`Join ${contest.title} contest`}
                    >
                        <span>Participate</span>
                        <svg className="ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                    </a>
                </div>
            </div>
        </div>

    )
}