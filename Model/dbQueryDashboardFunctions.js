const conn = require('./dbConfig');

// Function to fetch user content by ID
const fetchUserContentById = async (userId) => {
    const query = "SELECT id, username, f_name, l_name, user_bio, timezone, created_at, profile_img FROM users_tbl WHERE id = ?";
    const [results] = await conn.promise().query(query, [userId]);
    return results; // Return the results for further checks
};

// Function to fetch all tweets
const fetchAllTweets = async (userId) => {
    const query = `
        SELECT 
            t.id AS tweet_id, 
            t.user_id, 
            t.content, 
            t.created_at AS tweet_created_at, 
            t.modified_at AS tweet_modified_at, 
            u.timezone, 
            u.username, 
            u.f_name, 
            u.l_name,
            u.profile_img
        FROM 
            tweets_tbl t
        JOIN 
            users_tbl u ON t.user_id = u.id
        WHERE
            t.is_deleted = 0
        ORDER BY
            tweet_created_at DESC;
    `;
    const [rows] = await conn.promise().execute(query, [userId]);
    return rows.map(tweet => ({
        tweetId: tweet.tweet_id,
        userId: tweet.user_id,
        content: tweet.content,
        createdAt: tweet.tweet_created_at,
        modifiedAt: tweet.tweet_modified_at,
        timezone: tweet.timezone,
        username: tweet.username,
        firstName: tweet.f_name,
        lastName: tweet.l_name,
        avatar: tweet.profile_img,
    }));
};

// Function to toggle follow user
const toggleFollowUser = async (userId, targetUserId) => {
    const checkQuery = "SELECT * FROM followers_tbl WHERE follower_id = ? AND followed_id = ?";
    const [checkResults] = await conn.promise().query(checkQuery, [userId, targetUserId]);

    if (checkResults.length > 0) {
        // Unfollow
        await conn.promise().query("DELETE FROM followers_tbl WHERE follower_id = ? AND followed_id = ?", [userId, targetUserId]);
        return { ok: true, message: "Unfollowed successfully" };
    } else {
        // Follow
        await conn.promise().query("INSERT INTO followers_tbl (follower_id, followed_id, followed_at) VALUES (?, ?, UTC_TIMESTAMP())", [userId, targetUserId]);
        return { ok: true, message: "Followed successfully" };
    }
};

// Function to toggle like
const toggleLike = async (userId, tweetId) => {
    const checkQuery = "SELECT * FROM likes_tbl WHERE user_id = ? AND tweet_id = ?";
    const [checkResults] = await conn.promise().query(checkQuery, [userId, tweetId]);

    if (checkResults.length > 0) {
        // If already liked, unlike the tweet
        await conn.promise().query("DELETE FROM likes_tbl WHERE user_id = ? AND tweet_id = ?", [userId, tweetId]);
        return { ok: true, message: "Tweet unliked" };
    } else {
        // If not liked, like the tweet
        await conn.promise().query("INSERT INTO likes_tbl (user_id, tweet_id, created_at) VALUES (?, ?, UTC_TIMESTAMP)", [userId, tweetId]);
        return { ok: true, message: "Tweet liked" };
    }
};

// Function to reply to a tweet
const replyTweet = async (userId, tweetId, content) => {
    await conn.promise().query("INSERT INTO comments_tbl (user_id, tweet_id, content, created_at) VALUES (?, ?, ?, UTC_TIMESTAMP)", [userId, tweetId, content]);
    return { ok: true, message: "Reply posted successfully" };
};

// Function to retweet
const retweetTweet = async (userId, tweetId, content) => {
    await conn.promise().query("INSERT INTO retweets_tbl (user_id, tweet_id, content, created_at) VALUES (?, ?, ?, UTC_TIMESTAMP)", [userId, tweetId, content]);
    return { ok: true, message: "Tweet retweeted successfully" };
};

// Function to create a tweet
const makeTweets = async (userId, text) => {
    const [result] = await conn.promise().query("INSERT INTO tweets_tbl (user_id, content, created_at) VALUES (?, ?, UTC_TIMESTAMP)", [userId, text]);
    return { ok: true, message: "Tweet created successfully", tweetId: result.insertId };
};

// Function to fetch total likes
const fetchTotalLikes = async () => {
    const [results] = await conn.promise().query("SELECT tweet_id, COUNT(*) AS total_likes FROM likes_tbl GROUP BY tweet_id");
    return { ok: true, data: results };
};

// Function to fetch followers
const fetchFollowers = async (userId) => {
    const query = "SELECT u.id, u.username, u.f_name, u.l_name FROM followers_tbl f JOIN users_tbl u ON f.follower_id = u.id WHERE f.followed_id = ?";
    const [results] = await conn.promise().query(query, [userId]);
    return { ok: true, followers: results };
};

// Function to fetch following
const fetchFollowing = async (userId) => {
    const query = "SELECT u.id, u.username, u.f_name, u.l_name FROM followers_tbl f JOIN users_tbl u ON f.followed_id = u.id WHERE f.follower_id = ?";
    const [results] = await conn.promise().query(query, [userId]);
    return { ok: true, following: results };
};

// Function to show replies
const showReply = async (tweetId) => {
    const query = `
        SELECT c.id, c.content, c.created_at, 
               u.id AS user_id, u.username, u.f_name, u.l_name, u.profile_img
        FROM comments_tbl c
        JOIN users_tbl u ON c.user_id = u.id
        WHERE c.tweet_id = ?
    `;
    const [results] = await conn.promise().query(query, [tweetId]);
    return { ok: true, replies: results };
};

// Function to show retweets
const showRetweet = async (tweetId) => {
    const query = `
        SELECT r.id AS retweet_id, 
               r.created_at AS retweet_created_at, 
               r.content AS retweet_content, 
               u.id AS user_id, 
               u.username, 
               u.f_name, 
               u.l_name, 
               u.profile_img 
        FROM retweets_tbl r 
        JOIN users_tbl u ON r.user_id = u.id 
        WHERE r.tweet_id = ?
    `;
    const [results] = await conn.promise().query(query, [tweetId]);
    return { ok: true, retweets: results };
};

// Function to get total followers
const totalFollowers = async (userId) => {
    const [rows] = await conn.promise().query('SELECT COUNT(*) AS totalFollowers FROM followers_tbl WHERE followed_id = ?', [userId]);
    return { totalFollowers: rows[0].totalFollowers };
};

// Function to get total following
const totalFollowing = async (userId) => {
    const [rows] = await conn.promise().query('SELECT COUNT(*) AS totalFollowing FROM followers_tbl WHERE follower_id = ?', [userId]);
    return { totalFollowing: rows[0].totalFollowing };
};

// Function to fetch all retweets
const fetchAllRetweets = async () => {
    const query = `
        SELECT
            t.id AS tweet_id,
            t.content AS tweet_content,
            t.created_at AS tweet_created_at,
            t.user_id AS tweet_user_id,
            u1.id AS original_user_id,
            u1.username AS original_username,
            u1.f_name AS original_f_name,
            u1.l_name AS original_l_name,
            u1.profile_img AS original_profile_img,
            r.id AS retweet_id,
            r.created_at AS retweet_created_at,
            r.content AS retweet_content,
            u2.id AS retweeter_user_id,  -- User who retweeted
            u2.username AS retweeter_username,
            u2.f_name AS retweeter_f_name,
            u2.l_name AS retweeter_l_name,
            u2.profile_img AS retweeter_profile_img
        FROM
            tweets_tbl t
        JOIN
            retweets_tbl r ON t.id = r.tweet_id
        JOIN
            users_tbl u1 ON t.user_id = u1.id  -- Join for the original tweet's user
        JOIN
            users_tbl u2 ON r.user_id = u2.id  -- Join for the retweeter's user
        ORDER BY
            r.created_at ASC;
        `;

    const [results] = await conn.promise().query(query);
    return results;
};

// Function to fetch the list of users and their follow status
const fetchUsersWithFollowStatus = async (userId) => {
    const usersQuery = "SELECT id, username, f_name, l_name, profile_img FROM users_tbl WHERE id != ?";
    const [users] = await conn.promise().query(usersQuery, [userId]);

    const followingQuery = "SELECT followed_id FROM followers_tbl WHERE follower_id = ?";
    const [following] = await conn.promise().query(followingQuery, [userId]);

    const followingSet = new Set(following.map(f => f.followed_id));
    const usersWithFollowButton = users.map(user => ({ ...user, followed: followingSet.has(user.id) }));

    return usersWithFollowButton; // Return the users with follow status
};



module.exports = {
    fetchUserContentById,
    fetchAllTweets,
    toggleFollowUser,
    toggleLike,
    replyTweet,
    retweetTweet,
    makeTweets,
    fetchTotalLikes,
    fetchFollowers,
    fetchFollowing,
    showReply,
    showRetweet,
    totalFollowers,
    totalFollowing,
    fetchAllRetweets,
    fetchUsersWithFollowStatus,
};