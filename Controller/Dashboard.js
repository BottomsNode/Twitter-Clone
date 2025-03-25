const dbQueries = require("../Model/dbQueryDashboardFunctions");

const Dashboard = (req, res) => {
    if (req.session.userId) {
        res.render("dashboard/dashboard");
    } else {
        res.redirect('/auth/main-login');
    }
};

const getUserContent = async (req, res) => {
    const userId = req.session.userId;
    if (!userId) {
        return res.status(401).json({ ok: false, message: "User  not authenticated." });
    }

    try {
        const results = await dbQueries.fetchUserContentById(userId);

        if (results.length === 0) {
            return res.status(404).json({ ok: false, message: "User  not found." });
        }

        const user = results[0];
        const profileImageUrl = user.profile_img ? `Media/images/${user.profile_img}` : "https://api.dicebear.com/6.x/fun-emoji/svg?seed=User ";

        return res.json({
            ok: true,
            user: { ...user, profileImage: profileImageUrl }
        });

    } catch (error) {
        console.error("Error fetching user content:", error);
        return res.status(500).json({ ok: false, message: "Internal Server Error" });
    }
};

const getFollowersList = async (req, res) => {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ ok: false, message: "Unauthorized" });

    try {
        const usersWithFollowButton = await dbQueries.fetchUsersWithFollowStatus(userId);
        return res.json({ ok: true, users: usersWithFollowButton });
    } catch (error) {
        console.error("Error fetching user list:", error);
        return res.status(500).json({ ok: false, message: "Internal Server Error" });
    }
};

const fetchAllTweets = async (req, res) => {
    const userId = req.session.userId;

    try {
        const tweets = await dbQueries.fetchAllTweets(userId);
        res.status(200).json(tweets);
    } catch (error) {
        console.error('Error fetching tweets:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
};

const toggleFollowUser = async (req, res) => {
    const userId = req.session.userId;
    const { userId: targetUserId } = req.body;

    if (!userId) return res.status(401).json({ ok: false, message: "Unauthorized" });

    try {
        const result = await dbQueries.toggleFollowUser(userId, targetUserId);
        return res.json(result);
    } catch (error) {
        console.error("Error following/unfollowing user:", error);
        return res.status(500).json({ ok: false, message: "Internal Server Error" });
    }
};

const toggleLike = async (req, res) => {
    const userId = req.session.userId;
    const tweetId = req.params.id;

    if (!userId) return res.status(401).json({ ok: false, message: "Unauthorized" });

    try {
        const result = await dbQueries.toggleLike(userId, tweetId);
        return res.json(result);
    } catch (error) {
        console.error("Error liking/unliking tweet:", error);
        return res.status(500).json({ ok: false, message: "Internal Server Error" });
    }
};

const replyTweet = async (req, res) => {
    const userId = req.session.userId;
    const tweetId = req.params.id;
    const { content } = req.body;

    if (!userId) return res.status(401).json({ ok: false, message: "Unauthorized" });
    if (!content) return res.status(400).json({ ok: false, message: "Content is required" });

    try {
        const result = await dbQueries.replyTweet(userId, tweetId, content);
        return res.json(result);
    } catch (error) {
        console.error("Error posting reply:", error);
        return res.status(500).json({ ok: false, message: "Internal Server Error" });
    }
};

const retweetTweet = async (req, res) => {
    const userId = req.session.userId;
    const tweetId = req.params.id;
    const { content } = req.body;

    if (!userId) return res.status(401).json({ ok: false, message: "Unauthorized" });

    try {
        const result = await dbQueries.retweetTweet(userId, tweetId, content);
        return res.json(result);
    } catch (error) {
        console.error("Error retweeting:", error);
        return res.status(500).json({ ok: false, message: "Internal Server Error" });
    }
};

const makeTweets = async (req, res) => {
    const userId = req.session.userId;
    const { text } = req.body;

    if (!userId) return res.status(401).json({ ok: false, message: "Unauthorized" });

    try {
        const result = await dbQueries.makeTweets(userId, text);
        return res.status(201).json(result);
    } catch (error) {
        console.error("Error inserting tweet:", error);
        return res.status(500).json({ ok: false, message: "Internal Server Error" });
    }
};

const fetchTotalLikes = async (req, res) => {
    try {
        const result = await dbQueries.fetchTotalLikes();
        return res.json(result);
    } catch (error) {
        console.error("Error fetching total likes:", error);
        return res.status(500).json({ ok: false, message: "Internal server error" });
    }
};

const fetchFollowers = async (req, res) => {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ ok: false, message: "Unauthorized" });

    try {
        const result = await dbQueries.fetchFollowers(userId);
        return res.json(result);
    } catch (error) {
        console.error("Error fetching followers:", error);
        return res.status(500).json({ ok: false, message: "Internal Server Error" });
    }
};

const fetchFollowing = async (req, res) => {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ ok: false, message: "Unauthorized" });

    try {
        const result = await dbQueries.fetchFollowing(userId);
        return res.json(result);
    } catch (error) {
        console.error("Error fetching following:", error);
        return res.status(500).json({ ok: false, message: "Internal Server Error" });
    }
};

const showReply = async (req, res) => {
    const { tweetId } = req.params;

    try {
        const result = await dbQueries.showReply(tweetId);
        res.json(result);
    } catch (error) {
        console.error('Error fetching replies:', error);
        res.status(500).json({ ok: false, message: 'Failed to fetch replies' });
    }
};

const showAllRetweet = async (req, res) => {
    try {
        const results = await dbQueries.fetchAllRetweets();
        res.json({ ok: true, retweets: results });
    } catch (error) {
        console.error('Error fetching retweets:', error);
        res.status(500).json({ ok: false, message: 'Failed to fetch retweets' });
    }
};

const totalFollowers = async (req, res) => {
    const userId = req.session.userId;

    try {
        const result = await dbQueries.totalFollowers(userId);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching total followers:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const totalFollowing = async (req, res) => {
    const userId = req.session.userId;

    try {
        const result = await dbQueries.totalFollowing(userId);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching total following:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const fetchAllTweetsAndRetweets = async (req, res) => {
    const userId = req.session.userId;

    try {
        // Fetch tweets and retweets
        const tweets = await dbQueries.fetchAllTweets(userId);
        const retweets = await dbQueries.fetchAllRetweets();

        // Combine tweets and retweets into a single array
        const combined = [...tweets, ...retweets];

        // Sort the combined array by created_at time (newest first)
        combined.sort((a, b) => new Date(b.createdAt || b.retweet_created_at) - new Date(a.createdAt || a.retweet_created_at));

        // Return the sorted results
        res.status(200).json({ ok: true, data: combined });
    } catch (error) {
        console.error('Error fetching tweets and retweets:', error);
        res.status(500).json({ ok: false, message: 'Failed to fetch tweets and retweets' });
    }
};

module.exports = {
    Dashboard,
    getUserContent,
    getFollowersList,
    toggleFollowUser,
    fetchFollowers,
    fetchFollowing,
    makeTweets,
    toggleLike,
    replyTweet,
    retweetTweet,
    fetchTotalLikes,
    fetchAllTweetsAndRetweets,
    showReply, totalFollowers,
    totalFollowing,
    showAllRetweet,
    fetchAllTweets,
};