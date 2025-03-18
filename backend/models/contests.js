import mongoose from "mongoose";
import yts from "yt-search";

const PLAYLISTS = {
  leetcode: 'PLcXpkI9A-RZI6FhydNz3JBt_-p_i25Cbr',
  codeforces: 'PLcXpkI9A-RZLUfBSNp-YQBCOezZKbDSgB',
  codechef: 'PLcXpkI9A-RZIZ6lsE0KCcLWeKNoG45fYr'
};

const contestSchema = new mongoose.Schema({
  platform: {
    type: String,
    required: true,
    enum: ['codechef', 'codeforces', 'leetcode']
  },
  title: {
    type: String,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  solutionLink: {
    type: String
  },
  // Using compound index of platform+title+startTime as a unique identifier
  uniqueId: {
    type: String,
    required: true,
    unique: true
  },
  addedAt: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient querying
contestSchema.index({ platform: 1, title: 1, startTime: 1 }, { unique: true });

const Contest = mongoose.model("Contest", contestSchema);

function generateUniqueId(platform, contest) {
  return `${platform}-${contest.title}-${contest.startTime}`.replace(/[^a-zA-Z0-9-]/g, '-');
}

// Function to update contests from a specific platform
async function updateContestsFromPlatform(platform, fetchFunction) {
  try {
    console.log(`Fetching contests from ${platform}...`);
    const contests = await fetchFunction();

    console.log(`Retrieved ${contests.length} contests from ${platform}`);

    let addedCount = 0;
    let updateCount = 0;

    // Process each contest
    for (const contest of contests) {
      const uniqueId = generateUniqueId(platform, contest);

      // Try to find existing contest
      const existingContest = await Contest.findOne({ uniqueId });

      if (!existingContest) {
        if(platform === 'codechef' && parseCustomDate(contest.startTime) === null) {
          continue;
        }
        // Create new contest document
        const newContest = new Contest({
          platform,
          title: contest.title,
          startTime: contest.startTime,
          duration: contest.duration,
          url: contest.url,
          uniqueId,
          addedAt: new Date(),
          lastUpdated: new Date()
        });

        await newContest.save();
        addedCount++;
      } else {
        // Update existing contest if needed
        // This is optional - depends if you want to update existing records
        existingContest.duration = contest.duration;
        existingContest.lastUpdated = new Date();
        await existingContest.save();
        updateCount++;
      }
    }

    console.log(`${platform}: Added ${addedCount} new contests, updated ${updateCount} existing contests`);
    return { added: addedCount, updated: updateCount, total: contests.length };
  } catch (error) {
    console.error(`Error updating ${platform} contests:`, error);
    throw error;
  }
}

function parseCustomDate(dateString) {
  try {
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

      return null; // If parsing fails
  } catch (error) {
      console.error("Error parsing date:", error);
      return null;
  }
};

// Main function to update all contests
async function updateAllContests(fetchCodeChefContests, fetchCodeforcesContests, fetchLeetCodeContests) {
  try {
    console.log('Starting update for all platforms...');

    // Update contests from all platforms
    const results = await Promise.all([
      updateContestsFromPlatform('codechef', fetchCodeChefContests),
      updateContestsFromPlatform('codeforces', fetchCodeforcesContests),
      updateContestsFromPlatform('leetcode', fetchLeetCodeContests)
    ]);

    console.log('All platforms updated successfully');

    return {
      codechef: results[0],
      codeforces: results[1],
      leetcode: results[2],
      timestamp: new Date()
    };
  } catch (error) {
    console.error('Error in updateAllContests:', error);
    throw error;
  }
}

// Function to get upcoming contests
async function getUpcomingContests() {
  try {
    const now = new Date();

    // Find all contests where startTime is in the future
    // Note: This assumes startTime can be parsed as a date
    // You might need to adjust this query based on your actual date format
    const contests = await Contest.find({
      startTime: { $gte: now.toISOString() }
    }).sort('startTime');

    return contests;
  } catch (error) {
    console.error('Error getting upcoming contests:', error);
    throw error;
  }
}

/**
 * function to schedule regular updates for contests
 * @param {*} fetchFunctions
 * @param {*} intervalHours
 * @returns {NodeJS.Timeout}
 */
function scheduleContestUpdates(fetchFunctions, intervalHours = 24) {
  const intervalMs = intervalHours * 60 * 60 * 1000;

  console.log(`Scheduling contest updates every ${intervalHours} hours`);

  // Run update function with the fetch functions
  const runUpdate = () => {
    return updateAllContests(
      fetchFunctions.codechef,
      fetchFunctions.codeforces,
      fetchFunctions.leetcode
    );
  };

  // Run immediately
  runUpdate().catch(console.error);

  // Schedule periodic updates
  return setInterval(runUpdate, intervalMs);
}

async function updateContestSolutionVideos(Contest) {
  try {
    console.log('Starting solution video update...');
    let totalAdded = 0;
    
    // Process each platform
    for (const platform of Object.keys(PLAYLISTS)) {
      // Get all contests without solution links for this platform
      const contests = await Contest.find({ 
        platform, 
        solutionLink: { $exists: false }
      });
      
      if (contests.length === 0) {
        console.log(`No contests without solutions for ${platform}`);
        continue;
      }
      
      console.log(`Found ${contests.length} contests without solutions for ${platform}`);
      
      // Fetch videos from this platform's playlist
      console.log(`Fetching videos from ${platform} playlist...`);
      const result = await yts({ listId: PLAYLISTS[platform] });
      const videos = result.videos || [];
      
      console.log(`Found ${videos.length} videos in ${platform} playlist`);
      
      // For each video, check if it matches any contest
      for (const video of videos) {
        const videoTitle = video.title.toLowerCase();
        
        // Check each contest for a match
        for (const contest of contests) {
          // Skip if this contest already has a solution link
          if (contest.solutionLink) continue;
          
          const contestTitle = contest.title.toLowerCase();
          
          // Simple check: if video title contains contest title
          if (videoTitle.includes(contestTitle)) {
            // Add solution link to contest
            contest.solutionLink = "https://www.youtube.com/watch?v=" + video.videoId;
            await contest.save();
            
            console.log(`Added solution video for ${contest.title}: ${video.url}`);
            totalAdded++;
            break; // Move to next video
          }
        }
      }
    }
    
    console.log(`Solution update complete. Added ${totalAdded} solution videos.`);
    return { added: totalAdded };
  } catch (error) {
    console.error('Error updating solution videos:', error);
    throw error;
  }
}

// Function to schedule regular updates
function scheduleSolutionUpdates(Contest, intervalHours = 24) {
  const intervalMs = intervalHours * 60 * 60 * 1000;
  
  console.log(`Scheduling solution video updates every ${intervalHours} hours`);
  
  // Run immediately
  const runUpdate = () => updateContestSolutionVideos(Contest).catch(console.error);
  runUpdate();
  
  // Schedule periodic updates
  return setInterval(runUpdate, intervalMs);
}

export { Contest, updateAllContests, getUpcomingContests, scheduleContestUpdates, scheduleSolutionUpdates };