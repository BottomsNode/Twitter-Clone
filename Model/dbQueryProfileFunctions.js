const conn = require('./dbConfig');

// Function to fetch a user by ID
const fetchUserById = async (userId) => {
    const query = "SELECT * FROM users_tbl WHERE id = ?";
    const [results] = await conn.promise().query(query, [userId]);
    return results; // Return the results for further checks
};

// Function to fetch user data by ID
const fetchUserDataById = async (userId) => {
    const query = "SELECT * FROM users_tbl WHERE id = ?";
    const [results] = await conn.promise().query(query, [userId]);
    return results; // Return the results for further checks
};

// Function to fetch user profile by ID
const fetchUserProfileById = async (userId) => {
    const query = "SELECT * FROM users_tbl WHERE id = ?";
    const [results] = await conn.promise().query(query, [userId]);
    return results; // Return the results for further checks
};

// Function to fetch followers count
const fetchFollowersCount = async (userId) => {
    const query = "SELECT COUNT(*) AS totalFollowers FROM followers_tbl WHERE followed_id = ?";
    const [result] = await conn.promise().query(query, [userId]);
    return result[0]; // Return the count
};

// Function to fetch followings count
const fetchFollowingsCount = async (userId) => {
    const query = "SELECT COUNT(*) AS totalFollowing FROM followers_tbl WHERE follower_id = ?";
    const [result] = await conn.promise().query(query, [userId]);
    return result[0]; // Return the count
};

// Function to fetch tweets count
const fetchTweetsCount = async (userId) => {
    const query = "SELECT COUNT(*) AS totalTweets FROM tweets_tbl WHERE user_id = ?";
    const [result] = await conn.promise().query(query, [userId]);
    return result[0]; // Return the count
};

// Function to fetch followers list
const fetchFollowersList = async (userId) => {
    const query = `
        SELECT 
            u.id, 
            u.username, 
            u.f_name, 
            u.l_name, 
            u.user_bio, 
            u.user_email, 
            u.password, 
            u.profile_img, 
            u.is_user_verified, 
            u.is_email_verified, 
            u.is_active, 
            u.is_deleted, 
            u.timezone, 
            u.created_at, 
            u.modified_at,
            f.follower_id, 
            f.followed_at AS followed_at
        FROM 
            users_tbl u
        JOIN 
            followers_tbl f ON u.id = f.follower_id
        WHERE 
            f.followed_id = ?`;
    const [followers] = await conn.promise().query(query, [userId]);
    return followers; // Return the list of followers
};

// Function to fetch followings list
const fetchFollowingsList = async (userId) => {
    const query = `
        SELECT 
            u.id, 
            u.username, 
            u.f_name, 
            u.l_name, 
            u.user_bio, 
            u.user_email, 
            u.password, 
            u.profile_img, 
            u.is_user_verified, 
            u.is_email_verified, 
            u.is_active, 
            u.is_deleted, 
            u.timezone, 
            u.created_at, 
            u.modified_at,
            f.followed_id, 
            f.followed_at AS followed_at
        FROM 
            users_tbl u
        JOIN 
            followers_tbl f ON u.id = f.followed_id
        WHERE 
            f.follower_id = ?;`;
    const [following] = await conn.promise().query(query, [userId]);
    return following; // Return the list of followings
};

// Function to fetch tweets
const fetchTweets = async (userId) => {
    const query = "SELECT * FROM tweets_tbl WHERE user_id = ? ORDER BY created_at DESC;";
    const [tweets] = await conn.promise().query(query, [userId]);
    return tweets; // Return the list of tweets
};


module.exports = {
    fetchUserById,
    fetchUserProfileById,
    fetchUserDataById,
    fetchFollowersCount, 
    fetchFollowingsCount,
    fetchTweetsCount,
    fetchFollowersList,
    fetchFollowingsList,
    fetchTweets,
};