import axios from 'axios';

export async function fetchLeetCodeContests() {
    try {
        const response = await axios.post(
            'https://leetcode.com/graphql',
            {
                query: `{
                    allContests {
                        title
                        titleSlug
                        startTime
                        duration
                    }
                }`
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Referer': 'https://leetcode.com/contest/',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'
                }
            }
        );

        const contests = response.data.data.allContests;
        contests.forEach(contest => {
            const startDate = new Date(contest.startTime * 1000);
            const formattedDate = startDate.toLocaleString();
            contest.startTime = formattedDate;
            contest.duration = `${contest.duration / 3600} hours`;
            contest.url = `https://leetcode.com/contest/${contest.titleSlug}`;
            delete contest.titleSlug;
        });

        // return 10 contests only
        return contests.slice(0, 10);
    } catch (error) {
        console.error('Error fetching LeetCode contests:', error.response?.status, error.response?.data);
    }
}