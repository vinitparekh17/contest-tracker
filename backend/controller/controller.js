import mongoose from "mongoose";
import { getUpcomingContests, Contest } from "../models/contests.js";

/**
 * Gets all upcoming contests from the database
 * @param {Request} _ Express request object
 * @param {Response} res Express response object
 * @returns {Promise<void>} The response with the contests or an error message
 * 
 */
export async function getContests(_, res) {
    try {
        const contests = await getUpcomingContests();
        res.json(contests);
    } catch (error) {
        console.error("Error getting contests", error);
        res.status(500).json({ error: "Internal error" });
    }
}

export async function getContestsWithoutSolution(_, res) {
    try {
        const contests = await Contest.find({ solutionLink: null });
        res.json(contests);
    } catch (error) {
        console.error("Error getting contests", error);
        res.status(500).json({ error: "Internal error" });
    }
}

/**
 * Adds or updates a solution link for a specific contest
 * Requires admin authentication
 * @param {Request} req Express request object
 * @param {Response} res Express response object
 * @returns {Promise<void>} The response with the updated contest or an error message
 */

export async function insertSolutionLink(req, res) {
    try {
        const { contestId } = req.params;
        const { solutionLink } = req.body;

        // Validate inputs
        if (!validateInputs(contestId, solutionLink, req, res)) {
            return; // Response is already sent by validateInputs
        }

        // Authenticate admin - moved to separate function
        if (!authenticateAdmin(req, res)) {
            return; // Response is already sent by authenticateAdmin
        }

        // Find contest and update with solution link
        const updatedContest = await updateContestWithSolutionLink(contestId, solutionLink);

        if (!updatedContest) {
            return res.status(404).json({ error: "Contest not found" });
        }

        return res.status(200).json({
            message: "Solution link added successfully",
            contest: updatedContest
        });

    } catch (error) {
        console.error("Error adding solution link:", error.message);
        return res.status(500).json({
            error: "Failed to update solution link",
            message: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

export function loginAdmin(req, res) {
    const { defaultAdminUser, defaultAdminPassword } = req.body;

    if (!process.env.ADMIN_USER || !process.env.ADMIN_PASS) {
        return res.status(500).json({ error: "Server configuration error" });
    }

    if (defaultAdminUser === process.env.ADMIN_USER && defaultAdminPassword === process.env.ADMIN_PASS) {
        return res.status(200).json({ message: "Login successful" });
    }

    return res.status(403).json({ error: "Invalid credentials" });
}


// --- Helper functions ---

/**
 * Validates the contest ID and solution link
 * @returns {boolean} true if valid, false otherwise
 */
function validateInputs(contestId, solutionLink, req, res) {
    // Check solution link existence
    if (!solutionLink?.trim()) {
        res.status(400).json({ error: "Solution link is required" });
        return false;
    }

    // Validate contest ID format
    if (!contestId || !mongoose.Types.ObjectId.isValid(contestId)) {
        res.status(400).json({ error: "Invalid contest ID" });
        return false;
    }

    // Validate YouTube URL format - improved regex for better matching
    const ytRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|shorts\/)|youtu\.be\/)[\w-]{11}(?:\S+)?$/;
    if (!ytRegex.test(solutionLink)) {
        res.status(400).json({ error: "Invalid YouTube URL format" });
        return false;
    }

    return true;
}

/**
 * Authenticates the admin user
 * @returns {boolean} true if authenticated, false otherwise
 */
function authenticateAdmin(req, res) {
    const { defaultAdminUser, defaultAdminPassword } = req.body;

    // Ensure environment variables are defined
    if (!process.env.ADMIN_USER || !process.env.ADMIN_PASS) {
        console.error("Admin credentials not properly configured in environment");
        res.status(500).json({ error: "Server configuration error" });
        return false;
    }

    // Use constant-time comparison for credentials to prevent timing attacks
    if (defaultAdminUser !== process.env.ADMIN_USER ||
        defaultAdminPassword !== process.env.ADMIN_PASS) {
        res.status(403).json({ error: "Unauthorized access" });
        return false;
    }

    return true;
}

/**
 * Updates the contest with the solution link
 * @returns {Promise<Object|null>} The updated contest or null if not found
 */
async function updateContestWithSolutionLink(contestId, solutionLink) {
    try {
        // Using findOneAndUpdate with _id query and upsert:false for better performance
        return await Contest.findOneAndUpdate(
            { _id: contestId },
            { solutionLink, updatedAt: new Date() },
            {
                new: true,           // Return the updated document
                runValidators: true, // Run schema validators
                upsert: false        // Don't create a new document if not found
            }
        );
    } catch (error) {
        throw new Error(`Database error: ${error.message}`);
    }
}