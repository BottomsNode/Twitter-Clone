const express = require("express");
const router = express.Router();

const {
    Dashboard,
    getUserContent,
    getFollowersList,
    fetchAllTweets,
    fetchFollowers,
    fetchFollowing,
    toggleFollowUser,
    makeTweets,
    toggleLike,
    replyTweet,
    retweetTweet,
    fetchTotalLikes,
    showReply,
    showAllRetweet,
    totalFollowers,
    totalFollowing,
    fetchAllTweetsAndRetweets,
} = require("../Controller/Dashboard");

const Tokenization = require('../Middlewares/verifyTokenMiddleware');


router.get('/', Tokenization, Dashboard);

// FETCH USER DETAILS
router.get('/api/user', getUserContent);

// FETCH ALL USER LIST
router.get('/api/user-list', getFollowersList);

// FETCH ALL USER TWEETS
router.get('/api/get-tweets', fetchAllTweets);

// CREATE NEW TWEET
router.post('/api/tweets', makeTweets);

// FOLLOW/UNFOLLOW TWEET
router.post('/api/users/follow', toggleFollowUser);

// TOGGLE LIKE/UNLINE TWEET
router.post('/api/tweets/:id/like', toggleLike);

// REPLY TO TWEET
router.get('/api/tweets/:tweetId/replies', showReply);
router.post('/api/tweets/:id/reply', replyTweet);

// RETWEET TWEET
router.get('/api/all_retweets', showAllRetweet);
router.post('/api/tweets/:id/retweet',retweetTweet);

// FETCH  TOTAL LIKES COUNT
router.get('/api/get-likes', fetchTotalLikes);

// FETCH FOLLOWERS LIST
router.get('/api/followers', fetchFollowers);

// FETCH FOLLOWING LIST
router.get('/api/following', fetchFollowing);

// FETCH FOLLOWERES COUNT
router.get('/api/followers/total', totalFollowers);

// FETCH FOLLOWERES COUNT
router.get('/api/following/total', totalFollowing);

// FETCH ALL THE TWEETS AND RETWEETS
router.get('/api/all-tweets-and-retweets', fetchAllTweetsAndRetweets);

module.exports = router