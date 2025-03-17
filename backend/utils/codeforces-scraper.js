import axios from "axios";

/**
 * This function fetches upcoming contests from Codeforces using Axios.
 * @returns {Promise<Array<{ title: string, startTime: string, duration: string, url: string }>>}
 */
export async function fetchCodeforcesContests() {
    try {
        const response = await axios.get("https://codeforces.com/api/contest.list");
        return response.data.result
            .filter(contest => contest.phase === "BEFORE")
            .map(contest => ({
                title: contest.name,
                startTime: new Date(contest.startTimeSeconds * 1000).toISOString(),
                duration: `${contest.durationSeconds / 3600} hours`,
                url: `https://codeforces.com/contest/${contest.id}`
            }));
    } catch (error) {
        console.error("Error fetching Codeforces contests:", error);
        return [];
    }
};