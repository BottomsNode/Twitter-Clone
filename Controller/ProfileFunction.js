const conn = require("../Model/dbConfig");

const ProfilePage = async (req, res) => {
    res.render('profile/index');
}

const fetchCurrentUserId = async (req, res) => {
    const userId = req.session.userId;
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await conn.promise().query(`SELECT * FROM users_tbl WHERE id = ?`, [userId]);
    return res.json(user);
}

const fetchData = async (req, res) => {
    const userId = req.session.userId;
    try {
        const [data] = await conn.promise().query("SELECT * FROM users_tbl WHERE id = ?", [userId]);
        res.json(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send({ message: "Error fetching data" });
    }
}

const FetchUserProfile = async (req, res) => {
    const userId = req.params.userId;
    try {
        const [data] = await conn.promise().query("SELECT * FROM users_tbl WHERE id = ?", [userId]);
        res.json(data);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).send({ message: "Error fetching user profile" });
    }
}

const FetchFollowersCount = async (req, res) => {
    const userId = req.params.userId;
    try {
        const [result] = await conn.promise().query("SELECT COUNT(*) AS totalFollowers FROM followers_tbl WHERE followed_id = ?", [userId]);
        res.json(result[0]);
    } catch (error) {
        console.error('Error fetching total followers count:', error);
        res.status(500).send({ message: "Error fetching total followers count" });
    }
}

const FetchFollowingsCount = async (req, res) => {
    const userId = req.params.userId;
    try {
        const [result] = await conn.promise().query("SELECT  COUNT(*) AS totalFollowing FROM followers_tbl WHERE follower_id = ?", [userId]);
        res.json(result[0]);
    } catch (error) {
        console.error('Error fetching total following count:', error);
        res.status(500).send({ message: "Error fetching total following count" });
    }
}

const FetchTweetsCount = async (req, res) => {
    const userId = req.params.userId;
    try {
        const [result] = await conn.promise().query("SELECT COUNT(*) AS totalTweets FROM tweets_tbl WHERE user_id = ?", [userId]);
        res.json(result[0]);
    } catch (error) {
        console.error('Error fetching total tweets count:', error);
        res.status(500).send({ message: "Error fetching total tweets count" });
    }
}

const FetchFollowersList = async (req, res) => {
    const userId = req.params.userId;
    try {
        const [followers] = await conn.promise().query(`
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
            f.followed_id = ?`, [userId]);
        res.json(followers);
    } catch (error) {
        console.error('Error fetching followers:', error);
        res.status(500).send({ message: "Error fetching followers" });
    }
}

const FetchFollowingsList = async (req, res) => {
    const userId = req.params.userId;
    try {
        const [following] = await conn.promise().query(`
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
            f.follower_id = ?;`, [userId]);
        res.json(following);
    } catch (error) {
        console.error('Error fetching following:', error);
        res.status(500).send({ message: "Error fetching following" });
    }
}

const FetchTweets = async (req, res) => {
    const userId = req.params.userId;
    try {
        const [tweets] = await conn.promise().query("SELECT * FROM tweets_tbl WHERE user_id = ? ORDER BY created_at DESC; ", [userId]);
        res.json(tweets);
    } catch (error) {
        console.error('Error fetching user tweets:', error);
        res.status(500).send({ message: "Error fetching user tweets" });
    }
}

const EditProfilePage = async (req, res) => {
    const userId = req.session.userId;
    console.log(userId);
    try {
        const [user] = await conn.promise().query(`SELECT user_bio, user_email FROM users_tbl WHERE id = ?;`, [userId]);
        res.json(user);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).send({ message: "Error fetching user profile" });
    }
}

const EditProfileData = async (req, res) => {
    const userId = req.session.userId;
    const { bio, email } = req.body;
    console.log(req.body);
    try {
        await conn.promise().query(`UPDATE users_tbl SET user_bio = ?, user_email = ? WHERE id = ?;`, [bio, email, userId]);
        res.json({ message: "Profile updated successfully" });
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).send({ message: "Error updating user profile" });
    }
}

const DeleteTweet = async (req, res) => {
    const tweetId = req.params.tweetId;
    // delete the tweet
    try {
        await conn.promise().query("DELETE FROM tweets_tbl WHERE id = ?;", [tweetId]);
        res.json({ message: "Tweet deleted successfully" });
    } catch (error) {
        console.error('Error Deleting tweets:', error);
        res.status(500).send({ message: "Error Deleting tweets" });
    }
}

module.exports = {
    fetchCurrentUserId,
    ProfilePage,
    fetchData,
    FetchUserProfile,
    FetchFollowersCount,
    FetchFollowingsCount,
    FetchTweetsCount,
    FetchFollowersList,
    FetchFollowingsList,
    FetchTweets,
    EditProfilePage,
    EditProfileData,
    DeleteTweet,
};