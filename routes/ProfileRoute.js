const express = require("express");
const router = express.Router();

const {
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
} = require('../Controller/ProfileFunction');

const Tokenization = require('../Middlewares/verifyTokenMiddleware');

// Verify the Profile Page
router.get('/', Tokenization, ProfilePage);

// fetch Current User ID
router.get('/uid', fetchCurrentUserId);

// Fetch User Data
router.get('/data', fetchData);

// Route to fetch user profile data
router.get('/data/:userId', FetchUserProfile);

// Route to fetch total followers count
router.get('/followers/total/:userId', FetchFollowersCount);

// Route to fetch total following count
router.get('/following/total/:userId', FetchFollowingsCount);

// Route to fetch total following count
router.get('/tweets/total/:userId', FetchTweetsCount);

// Route to fetch user followers
router.get('/user/:userId/followers', FetchFollowersList);

// Route to fetch user following
router.get('/user/:userId/following', FetchFollowingsList);

// Route to fetch user tweets
router.get('/user/:userId/tweets', FetchTweets);

// Route to Edit the user profile
router.get('/edit', EditProfilePage);
router.put('/edit-data', EditProfileData);

// Route to delete the tweets
router.delete('/tweets/:tweetId', DeleteTweet);

module.exports = router