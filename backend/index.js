import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { fetchCodeChefContests } from './utils/codechef-scraper.js';
import { fetchCodeforcesContests } from './utils/codeforces-scraper.js';
import { fetchLeetCodeContests } from './utils/leetcode-scraper.js';
import { Contest,scheduleContestUpdates, scheduleSolutionUpdates } from './models/contests.js';
import { getContests, getContestsWithoutSolution, insertSolutionLink, loginAdmin } from './controller/controller.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/contest-tracker', {
    useUnifiedTopology: true
})
    .then(() => {
        console.log('Connected to MongoDB');

        // Define fetch functions
        const fetchFunctions = {
            codechef: fetchCodeChefContests,
            codeforces: fetchCodeforcesContests,
            leetcode: fetchLeetCodeContests
        };

        // Schedule updates every 12 hours
        const updateIntervalId = scheduleContestUpdates(fetchFunctions, 12);

        // Schedule solution updates every 6 hours
        const solutionUpdateIntervalId = scheduleSolutionUpdates(Contest, 6);

        // If we need to clear the interval later (e.g., during graceful shutdown)
        process.on('SIGINT', () => {
            console.log('Stopping scheduled updates...');
            clearInterval(updateIntervalId);
            clearInterval(solutionUpdateIntervalId);
            mongoose.connection.close();
            console.log('MongoDB connection closed');
            process.exit(0);
        });

        console.log('Contest tracker initialized and running');
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

/**
 * @route GET /
 * @description Default route that returns a welcome message
 */
app.get('/', (_, res) => res.json({ message: 'Contest tracker API' }));

/**
 * @route GET /api/contests
 * @description Get all upcoming contests from the database
 */
app.get('/api/contests', getContests);
app.get('/api/contests/without-solution', getContestsWithoutSolution);
app.patch('/api/contests/:contestId/solution', insertSolutionLink);

app.post('/api/admin/login', loginAdmin);

// start the server
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});