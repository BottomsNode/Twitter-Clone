console.log("Script Loaded..!");

document.addEventListener('DOMContentLoaded', async function () {
    try {
        await initializeDashboard();
    } catch (error) {
        console.error("Error initializing the dashboard:", error);
    }
});

// Initialize Dashboard
async function initializeDashboard() {
    await fetchUserData();
    await fetchAllTweets();
    await fetchAllLikes();
    await fetchFollowers();
    await fetchFollowing();
    await fetchUserList();
    initializeLikeStates();
    setupNewTweetForm();
    displayAllRetweets();
}

// --------------------------------------------------

// Fetch User Profile Functions
async function fetchUserData() {
    try {
        const response = await fetch('/dashboard/api/user');
        if (!response.ok) throw new Error('Failed to fetch user data');

        const { ok, user } = await response.json();
        if (!ok || !user) throw new Error('User data not found');
        // console.log(user);
        updateUserProfile(user);
    } catch (error) {
        console.error("Error fetching user data:", error);
    }
}
function updateUserProfile(user) {
    const { username, f_name, l_name, user_bio, timezone, created_at, profile_img } = user; 
    document.getElementById('username').textContent = username;
    document.getElementById('uname_marque').textContent = username + ' ' + f_name + ' ' + l_name;
    document.getElementById('bio').textContent = user_bio || "No bio available";
    document.getElementById('fullName').textContent = `${f_name} ${l_name}`;
    document.getElementById('location').textContent = timezone || "Not set";
    document.getElementById('joinedDate').textContent = formatDate(created_at);
    setProfileImage(profile_img, username);
    showWelcomeMessageOnce(`${f_name} ${l_name}`);
}
function formatDate(dateString) {
    return new Date(dateString).toISOString().split('T')[0];
}
function setProfileImage(imageFile, username) {
    const profileImageElement = document.getElementById('profileImage');
    profileImageElement.src = getProfileImagePath(imageFile, username);
    profileImageElement.onerror = () => {
        profileImageElement.src = `${profile_img}${encodeURIComponent(username)}`;
    };
}
function getProfileImagePath(imageFile, username) {
    // console.log('imageFile 1' , imageFile);
    return imageFile ? `Media/images/${imageFile}` : `https://api.dicebear.com/6.x/fun-emoji/svg?seed=${encodeURIComponent(username)}`;
}
function showWelcomeMessageOnce(fullName) {
    if (!localStorage.getItem('welcomeMessageShown')) {
        // Show the welcome message
        showWelcomeMessage(`Welcome, ${fullName}!`);

        // Set a flag in local storage to indicate that the message has been shown
        localStorage.setItem('welcomeMessageShown', 'true');
    }
}
function showWelcomeMessage(message) {
    const notification = document.createElement('div');
    notification.className = 'welcome-message';
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.display = 'block';
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(-50%)';
    }, 10);

    setTimeout(() => {
        notification.style.opacity = '0'; // Fade out
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 3000);
}
// --------------------------------------------------

// Fetch Tweet List,Like.Replies,Retweets Functions
async function fetchAllTweets() {
    await fetchData('/dashboard/api/get-tweets', "Tweets", updateTweetList);
}
function updateTweetList(tweets) {
    const tweetList = document.querySelector('#tweet-list');
    tweetList.innerHTML = '';
    tweets.forEach(tweet => tweetList.appendChild(createTweetElement(tweet)));
}
function createTweetElement(tweet) {
    const newTweet = document.createElement('div');
    newTweet.classList.add('tweet');
    newTweet.dataset.tweetId = tweet.tweetId;
    

    // Format the createdAt date
    const formattedDate = timeAgo(tweet.createdAt);

    // Set initial state of like button
    const likeText = tweet.isLiked ? '❤️' : '🤍';
    const likeCount = tweet.likeCount || 0;

    newTweet.innerHTML = `
        <div class="tweet-header">
            <img src='${getProfileImagePath(tweet.avatar, tweet.username)}' alt='${tweet.username}'>
            <strong>${tweet.username}</strong>
        </div>
        <div class="tweet-body">
            <p>${tweet.content}</p>
            <p hidden><strong>Timezone:</strong> <span id="timezone">${tweet.timezone}</span></p>
            <p hidden><strong>Created at:</strong> <span id="tweet_created_at">${tweet.createdAt}</span></p>
            <p hidden><strong>Modified at:</strong> <span id="tweet_modified_at">${tweet.modifiedAt}</span></p>
        </div>
        <div class="tweet-footer">
            <span>${formattedDate}</span>
            <button class="like-button" data-tweet-id="${tweet.tweetId}">${likeText} <span class="like-count">${likeCount}</span></button>
            <div class="reply-div">
                <button class="reply-button" data-tweet-id="${tweet.tweetId}">💬 Reply</button>
                <button class="show-reply-button" data-tweet-id="${tweet.tweetId}">Show Replies</button>
            </div>
            <div class="retweet-div">
                <button class="retweet-button" data-tweet-id="${tweet.tweetId}">🔁 Retweet</button>
            </div>
        </div>
    `;
    // Add event listeners for like, reply, and retweet buttons
    newTweet.querySelector('.like-button').addEventListener('click', () => handleLike(tweet.tweetId));
    newTweet.querySelector('.reply-button').addEventListener('click', () => handleReply(tweet.tweetId));
    newTweet.querySelector('.show-reply-button').addEventListener('click', () => handleShowReply(tweet.tweetId));
    newTweet.querySelector('.retweet-button').addEventListener('click', () => handleRetweet(tweet.tweetId));
    return newTweet;
}
function timeAgo(createdAt) {
    const tweetTime = new Date(createdAt);
    // console.log("Tweet Time: ", tweetTime);
    const currentTime = new Date();
    // console.log("Current Time: ", currentTime);
    const utcTime = new Date(currentTime.getTime() + currentTime.getTimezoneOffset() * 60000);
    // console.log("UTC Time: ", utcTime);

    // Calculate the time difference in seconds
    const timeDiff = Math.floor((utcTime - tweetTime) / 1000);
    const seconds = timeDiff;
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (seconds < 60) {
        return seconds === 1 ? '1 second ago' : `${seconds} seconds ago`;
    } else if (minutes < 60) {
        return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
    } else if (hours < 24) {
        return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
    } else if (days < 7) {
        return days === 1 ? '1 day ago' : `${days} days ago`;
    } else if (weeks < 4) {
        return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
    } else if (months < 12) {
        return months === 1 ? '1 month ago' : `${months} months ago`;
    } else {
        return years === 1 ? '1 year ago' : `${years} years ago`;
    }
}
async function fetchData(url, label, callback) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch ${label}`);

        const data = await response.json();
        if (callback) callback(data);
    } catch (error) {
        console.error(error);
    }
}


// Handle Likes
async function handleLike(tweetId) {
    const likeButton = document.querySelector(`[data-tweet-id="${tweetId}"] .like-button`);
    const isLiked = likeButton.innerHTML.includes('❤️');

    try {
        const response = await fetch(`dashboard/api/tweets/${tweetId}/like`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const result = await response.json();
        if (result.ok) {
            const likeCountElement = likeButton.querySelector('.like-count');
            const currentCount = parseInt(likeCountElement.textContent);
            let newCount = isLiked ? currentCount - 1 : currentCount + 1;

            // Ensure the like count does not go negative
            if (newCount < 0) {
                newCount = 0; // Set to 0 if it would go negative
            }

            // Update the button's inner HTML
            likeButton.innerHTML = isLiked
                ? `🤍 <span class="like-count">${newCount}</span>`
                : `❤️ <span class="like-count">${newCount}</span>`;

            // Save the like status in local storage
            updateLikeStatusInLocalStorage(tweetId, !isLiked);
            showNotification(result.message);
            const updatedLikes = await fetchUpdatedLikes(tweetId);
            updateLikeCountInUI(tweetId, updatedLikes);
        } else {
            console.error('Failed to update like status:', result.message);
        }
    } catch (error) {
        console.error('Error while liking tweet:', error);
    }
}
async function fetchUpdatedLikes(tweetId) {
    const response = await fetch(`dashboard/api/tweets/${tweetId}/like`);
    const data = await response.json();
    return data.likeCount;
}
function updateLikeCountInUI(tweetId, likeCount) {
    const likeCountElement = document.querySelector(`[data-tweet-id="${tweetId}"] .like-count`);
    likeCountElement.textContent = likeCount;
}
function updateLikeStatusInLocalStorage(tweetId, isLiked) {
    // Get the current likes from local storage
    const likes = JSON.parse(localStorage.getItem('likes')) || {};
    // Update the like status for the specific tweet
    likes[tweetId] = isLiked;
    // Save the updated likes back to local storage
    localStorage.setItem('likes', JSON.stringify(likes));
}
function initializeLikeStates() {
    const likes = JSON.parse(localStorage.getItem('likes')) || {};
    document.querySelectorAll('.like-button').forEach(button => {
        const tweetId = button.getAttribute('data-tweet-id');
        if (likes[tweetId]) {
            // If the tweet is liked, update the button's inner HTML
            const likeCountElement = button.querySelector('.like-count');
            const currentCount = parseInt(likeCountElement.textContent);
            button.innerHTML = `❤️ <span class="like-count">${currentCount}</span>`;
        }
    });
}
function showNotification(message) {
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notification-message');

    notificationMessage.textContent = message;
    notification.classList.remove('hidden');
    notification.classList.add('show');

    // Hide the notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        notification.classList.add('hidden');
    }, 3000);
}


// Handle Reply
async function handleReply(tweetId) {
    const modal = document.getElementById('reply-modal');
    const replyInput = document.getElementById('reply-input');
    const submitReplyButton = document.getElementById('submit-reply');
    const closeModalButton = document.getElementById('close-modal');

    modal.style.display = 'flex';

    replyInput.value = '';

    submitReplyButton.onclick = async () => {
        const replyContent = replyInput.value.trim();
        if (!replyContent) return;

        try {
            const response = await fetch(`dashboard/api/tweets/${tweetId}/reply`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: replyContent }),
            });

            const result = await response.json();
            if (result.ok) {
                alert('Reply posted successfully!');
                modal.style.display = 'none';
            } else {
                console.error('Failed to post reply:', result.message);
            }
        } catch (error) {
            console.error('Error while posting reply:', error);
        }
    };

    closeModalButton.onclick = () => {
        modal.style.display = 'none';
    };

    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
}
async function handleShowReply(tweetId) {
    const replies = await fetchReplies(tweetId);
    showReplyPopup(`Replies`, replies);
}
async function fetchReplies(tweetId) {
    try {
        const response = await fetch(`dashboard/api/tweets/${tweetId}/replies`);
        if (!response.ok) throw new Error('Failed to fetch replies');
        const data = await response.json();
        return data.replies;
    } catch (error) {
        console.error(error);
        return [];
    }
}
function showReplyPopup(title, replies) {
    const popup = document.getElementById('popup');
    const popupTitle = document.getElementById('popup-title');
    const popupList = document.getElementById('popup-list');

    popupTitle.textContent = title;
    popupList.innerHTML = '';

    if (replies.length === 0) {
        popupList.innerHTML = `<p>No Replies Yet</p>`;
    } else {
        replies.forEach(reply => {
            const userCard = ReplyPopCreateUserCard(reply);
            popupList.appendChild(userCard);
        });
    }

    popup.style.display = 'flex';
}
function ReplyPopCreateUserCard(reply) {
    const userCard = document.createElement('div');
    userCard.className = 'user-card';

    if (!reply || !reply.content) {
        userCard.innerHTML = `<p>No Replies Yet</p>`;
    } else {
        // Create a Date object from the UTC timestamp
        const utcDate = new Date(reply.created_at);

        // Get the timezone offset in minutes
        const timezoneOffset = utcDate.getTimezoneOffset(); // This returns the offset in minutes

        // Calculate the local time by adjusting the UTC date with the offset
        const localDate = new Date(utcDate.getTime() - timezoneOffset * 60000); // Convert minutes to milliseconds

        userCard.innerHTML = `
            <img src="Media/images/${reply.profile_img}" alt="${reply.username}" class="profile-image" />
            <div>
                <strong>${reply.f_name} ${reply.l_name} (@${reply.username})</strong>
                <p>Replied on: ${localDate.toLocaleString()}</p> <!-- Format the local date -->
                <p>Reply: ${reply.content}</p>
            </div>
        `;
    }
    return userCard;
}
function closePopup() {
    const popup = document.getElementById('popup');
    popup.style.display = 'none';
}


// Handle Retweets
async function handleRetweet(tweetId) {
    const modal = document.getElementById('retweet-modal');
    const retweetInput = document.getElementById('retweet-input');
    const submitRetweetButton = document.getElementById('submit-retweet');
    const closeRetweetModalButton = document.getElementById('close-retweet-modal');

    // Show the modal
    modal.style.display = 'flex';

    // Clear the input field
    retweetInput.value = '';

    // Handle the submit button click
    submitRetweetButton.onclick = async () => {
        const retweetContent = retweetInput.value.trim();
        try {
            const response = await fetch(`dashboard/api/tweets/${tweetId}/retweet`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: retweetContent }),
            });

            const result = await response.json();
            if (result.ok) {
                alert('Retweeted successfully!');
                modal.style.display = 'none';
                initializeDashboard();
            } else {
                console.error('Failed to retweet:', result.message);
            }
        } catch (error) {
            console.error('Error while retweeting:', error);
        }
    };

    // Handle the close button click
    closeRetweetModalButton.onclick = () => {
        modal.style.display = 'none'; // Close the modal
    };

    // Close the modal if the user clicks outside of it
    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
}
async function fetchRetweets() {
    try {
        const response = await fetch(`dashboard/api/all_retweets`);
        if (!response.ok) throw new Error('Failed to fetch retweets');
        const data = await response.json();
        return data.retweets;
    } catch (error) {
        console.error(error);
        return [];
    }
}
async function displayAllRetweets() {
    const retweets = await fetchRetweets(); // Fetch all retweets
    const retweetsContainer = document.getElementById('retweets-container');

    retweetsContainer.innerHTML = '';

    retweets.forEach(retweet => {
        displayRetweetCard(retweet);
    });
}
function displayRetweetCard(retweet) {
    const retweetsContainer = document.getElementById('retweets-container');

    // Create a new card for the retweet
    const retweetCard = document.createElement('div');
    retweetCard.className = 'tweet-card retweet-card';

    // Format the retweet created time
    const retweetCreatedAt = new Date(retweet.retweet_created_at);
    const currentTime = new Date();
    const utcTime = new Date(currentTime.getTime() + currentTime.getTimezoneOffset() * 60000);
    const timeDiff = Math.floor((utcTime - retweetCreatedAt) / 1000);

    // Function to format time difference
    const formatTimeDiff = (seconds) => {
        if (seconds < 60) {
            return seconds === 1 ? '1 second ago' : `${seconds} seconds ago`;
        } else if (seconds < 3600) {
            const minutes = Math.floor(seconds / 60);
            return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
        } else if (seconds < 86400) {
            const hours = Math.floor(seconds / 3600);
            return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
        } else {
            const days = Math.floor(seconds / 86400);
            return days === 1 ? '1 day ago' : `${days} days ago`;
        }
    };

    const formattedRetweetTime = formatTimeDiff(timeDiff);
    const originalTweetCreatedAt = formatDateToLocal(retweet.tweet_created_at);

    retweetCard.innerHTML = `
        <div class="tweet-header">
            <img src='${getProfileImagePath(retweet.retweeter_profile_img, retweet.retweeter_username)}' alt='${retweet.retweeter_username}' class="profile-image">
            <div class="user-info">
                <strong>${retweet.retweeter_username}</strong>
                <span class="tweet-date">${formattedRetweetTime}</span>
            </div>
        </div>
        <div class="tweet-body">
            <p><strong>Retweeted by:</strong> @${retweet.retweeter_username} (${retweet.retweeter_f_name} ${retweet.retweeter_l_name})</p>
            <p><strong>Retweeted Content:</strong> ${retweet.retweet_content || 'No content provided.'}</p>
            <div class="original-tweet">
                <p><strong>Original Tweet:</strong></p>
                <a href="#" class="original-tweet-link">
                    <p>${retweet.tweet_content || 'Original tweet content not available.'}</p>
                </a>
                <small><strong>Original Tweeted by:</strong> @${retweet.original_username} (${retweet.original_f_name} ${retweet.original_l_name})</small><br>
                <small>Created at: ${originalTweetCreatedAt}</small>
            </div>
        </div>
    `;

    retweetsContainer.prepend(retweetCard);

    // Add event listener to open modal with original tweet details
    retweetCard.querySelector('.original-tweet-link').addEventListener('click', function (event) {
        event.preventDefault();

        // Create the modal content with original user details
        const modalContent = `
        <div class="modal-header">
            <h2>Original Tweet Details</h2>
        </div>
        <div class="modal-body" style="display: flex; align-items: center;">
            <img src='${getProfileImagePath(retweet.original_profile_img, retweet.original_username)}' alt='${retweet.original_username}' class="profile-image" style="width: 50px; height: 50px; border-radius: 50%; margin-right: 10px;">
            <div>
                <p><strong>Content:</strong> ${retweet.tweet_content || 'Content not available.'}</p>
                <small><strong>Tweeted by:</strong> @${retweet.original_username} (${retweet.original_f_name} ${retweet.original_l_name})</small><br>
                <small>Created at: ${originalTweetCreatedAt}</small>
            </div>
        </div>
        <div class="modal-footer">
            <button class="close-modal-button">Close</button>
        </div>
    `;

        // Set the modal content and display it
        document.getElementById("modalTweetContent").innerHTML = modalContent;
        modal.style.display = "block";

        // Close modal functionality
        const closeModal = modal.querySelector('.close');
        closeModal.onclick = function () {
            modal.style.display = "none";
        }

        const closeModalButton = modal.querySelector('.close-modal-button');
        closeModalButton.onclick = function () {
            modal.style.display = "none";
        }
    });
}
function formatDateToLocal(dateString) {
    const date = new Date(dateString);
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    return date.toLocaleString(undefined, options);
}
const modal = document.createElement('div');
modal.className = 'modal';
modal.innerHTML = `
    <div class="modal-content">
        <span class="close"></span>
        <div id="modalTweetContent"></div>
    </div>
`;
document.body.appendChild(modal);

// Function to open the modal with original tweet details
function openModal(content) {
    document.getElementById("modalTweetContent").innerHTML = content;
    modal.style.display = "block";
}

// Close modal functionality
const closeModal = modal.querySelector('.close');
closeModal.onclick = function () {
    modal.style.display = "none";
}

window.onclick = function (event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
};
// --------------------------------------------------


// Fetch all likes and update the UI with the fetched likes count
async function fetchAllLikes() {
    try {
        const response = await fetch('dashboard/api/get-likes');
        if (!response.ok) throw new Error('Failed to fetch likes');

        const likes = await response.json();
        updateLikeList(likes);
    } catch (error) {
        console.error(error);
    }
}
function updateLikeList(likes) {
    likes.data.forEach(like => {
        const tweetId = like.tweet_id;
        const totalLikes = like.total_likes;
        const userLiked = like.user_liked;

        // Find the tweet element in the DOM
        const tweetElement = document.querySelector(`[data-tweet-id="${tweetId}"]`);
        if (tweetElement) {
            const likeButton = tweetElement.querySelector('.like-button');

            // Update the button's inner HTML to reflect the new like count
            likeButton.innerHTML = `${userLiked ? '❤️' : '🤍'} <span class="like-count">${totalLikes}</span>`;
        }
    });
}
async function fetchFollowers() {
    await fetchData('/dashboard/api/followers', "Followers");
}
// --------------------------------------------------

// Fetch Following
async function fetchFollowing() {
    await fetchData('/dashboard/api/following', "Following");
}
// --------------------------------------------------


// Fetch User List , Create User Card and Setup Follow Button Listeners
async function fetchUserList() {
    try {
        const response = await fetch('/dashboard/api/user-list');
        if (!response.ok) throw new Error('Failed to fetch user list');

        const { users } = await response.json();
        const userList = document.getElementById('userList-1');
        userList.innerHTML = '';

        users.forEach(user => {
            userList.appendChild(createUserCard(user));
        });
    } catch (error) {
        console.error(error);
    }
}
function createUserCard(user) {
    const userCard = document.createElement('div');
    userCard.className = 'user-card';
    userCard.innerHTML = `
        <img src="Media/images/${user.profile_img}?seed=${user.username}" 
            alt="${user.f_name} ${user.l_name}" class="profile-image" />
        <div>
            <p>${user.f_name} ${user.l_name} (@${user.username})</p>
        </div>
        <button class="follow-btn" data-user-id="${user.id}">
            ${user.followed ? 'Unfollow' : 'Follow'}
        </button>
    `;

    // Add event listener for the follow/unfollow button
    const followButton = userCard.querySelector('.follow-btn');
    followButton.addEventListener('click', async () => {
        const targetUserId = user.id;

        try {
            const response = await fetch('dashboard/api/users/follow', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: targetUserId }),
            });

            const result = await response.json();
            if (result.ok) {
                user.followed = !user.followed;
                followButton.textContent = user.followed ? 'Unfollow' : 'Follow';
            } else {
                console.error('Failed to update follow status:', result.message);
            }
        } catch (error) {
            console.error('Error while following/unfollowing user:', error);
        }
    });

    return userCard;
}
// --------------------------------------------------


// Setup new tweet form submission and Create a new Tweet
function setupNewTweetForm() {
    const newTweetForm = document.getElementById('tweetForm');
    newTweetForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const tweetText = this.elements['tweet-text'].value.trim();

        if (tweetText) {
            await createNewTweet(tweetText);
            this.elements['tweet-text'].value = ''; // Clear the input
        }
    });
}
async function createNewTweet(tweetText) {
    try {
        const tweetResponse = await fetch('dashboard/api/tweets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: tweetText })
        });

        if (!tweetResponse.ok) throw new Error('Failed to create tweet');

        const result = await tweetResponse.json();
        console.log(result);
        if (result.ok) {
            const tweetList = document.getElementById('tweet-list');
            const newTweet = createTweetElement(result.tweet);
            tweetList.appendChild(newTweet);
        }
    } catch (error) {
        console.error(error);
    }
}
// --------------------------------------------------



function confirmLogout() {
    localStorage.removeItem('welcomeMessageShown');
    return confirm("Are you sure you want to log out?");
}