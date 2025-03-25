document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/profile/uid');
        if (response.ok) {
            const data = await response.json();
            const user_obj = data[0];
            const user_data = user_obj[0];
            const user_id = user_data.id;
            await init(user_id);
        }
        else {
            console.error('Failed to fetch user data');
        }
    } catch (error) {
        console.error('An error occurred during initialization:', error);
    }
});

// Initialize function to fetch all necessary data
async function init(user_id) {
    const followersBtn = document.getElementById('followers-btn');
    const followingBtn = document.getElementById('following-btn');
    const followersListContainer = document.querySelector('.followers-list-container');
    const followingListContainer = document.querySelector('.following-list-container');

    // Aside Bar
    function showFollowers() {
        followersListContainer.style.display = 'block';
        followingListContainer.style.display = 'none';
    }

    // Aside Bar
    function showFollowing() {
        followingListContainer.style.display = 'block';
        followersListContainer.style.display = 'none';
    }

    // Event listeners for button clicks
    followersBtn.addEventListener('click', showFollowers);
    followingBtn.addEventListener('click', showFollowing);

    await fetchUserProfile(user_id);
    await fetchFollowersCount(user_id);
    await fetchFollowingsCount(user_id);
    await fetchUserFollowers(user_id);
    await fetchUserFollowing(user_id);
    await fetchUserTweets(user_id);
    await fetchTweetCount(user_id);
    showFollowers();
}


// Function to fetch user profile data
async function fetchUserProfile(user_id) {
    const userId = user_id;
    try {
        const response = await fetch(`profile/data/${userId}`);
        if (response.ok) {
            const data = await response.json();
            const details = data[0];
            arrangeProfilePage(details);
        }
        else {
            throw new Error('Failed to fetch profile data');
        }
    } catch (error) {
        console.error('Error fetching user profile:', error);
    }
}
function arrangeProfilePage(profile) {
    const profileHTML = `
        <h1>Profile Page</h1>
        <div class="profile-data">
            <img src="Media/images/${profile.profile_img}" alt="${profile.f_name} ${profile.l_name}" style="width: 120px; height: 110px; border-radius: 50%; margin-bottom: 20px;">
            <h2>${profile.f_name} ${profile.l_name}</h2>
            <table>
                <tbody>
                    <tr>
                        <td><strong>Username:</strong></td>
                        <td>@${profile.username}</td>
                    </tr>
                    <tr>
                        <td><strong>Email:</strong></td>
                        <td>${profile.user_email}</td>
                    </tr>
                    <tr>
                        <td><strong>Bio:</strong></td>
                        <td>${profile.user_bio || 'No bio available'}</td>
                    </tr>
                    <tr>
                        <td><strong>Timezone:</strong></td>
                        <td>${profile.timezone || 'Not set'}</td>
                    </tr>
                    <tr>
                        <td><strong>Account Status:</strong></td>
                        <td>${profile.is_active ? 'Active' : 'Inactive'}</td>
                    </tr>
                    <tr>
                        <td><strong>Email Verified:</strong></td>
                        <td>${profile.is_email_verified ? 'Verified' : 'Not Verified'}</td>
                    </tr>
                    <tr>
                        <td><strong>User Verified:</strong></td>
                        <td>${profile.is_user_verified ? 'Verified' : 'Not Verified'}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;
    document.getElementById('profile-header').innerHTML = profileHTML;
}



// Function to fetch total followers count
async function fetchFollowersCount(user_id) {
    try {
        const response = await fetch(`profile/followers/total/${user_id}`);
        if (!response.ok) throw new Error('Failed to fetch total followers count');
        const totalFollowers = await response.json();
        arrangeTotalFollowersCount(totalFollowers);
    } catch (error) {
        console.error('Error fetching total followers count:', error);
    }
}
function arrangeTotalFollowersCount(totalFollowers) {
    document.getElementById('total-followers-count').innerText = `Total Followers: ${totalFollowers.totalFollowers}`;
}



// Function to fetch total following count
async function fetchFollowingsCount(user_id) {
    try {
        const response = await fetch(`profile/following/total/${user_id}`);
        if (!response.ok) throw new Error('Failed to fetch total following count');
        const totalFollowing = await response.json();
        arrangeTotalFollowingCount(totalFollowing);
    } catch (error) {
        console.error('Error fetching total following count:', error);
    }
}
function arrangeTotalFollowingCount(totalFollowing) {
    document.getElementById('total-following-count').innerText = `Total Following: ${totalFollowing.totalFollowing}`;
}



// Function to fetch total tweet count
async function fetchTweetCount(user_id) {
    try {
        const response = await fetch(`profile/tweets/total/${user_id}`);
        if (!response.ok) throw new Error('Failed to fetch total tweet count');
        const totalTweets = await response.json();
        arrangeTotalTweetCount(totalTweets);
    } catch (error) {
        console.error('Error fetching total tweets count:', error);
    }
}
function arrangeTotalTweetCount(totalTweets) {
    document.getElementById('total-tweets-count').innerText = `Total Tweets: ${totalTweets.totalTweets}`;
}




// Function to fetch user followers
async function fetchUserFollowers(user_id) {
    try {
        const response = await fetch(`profile/user/${user_id}/followers`);
        if (!response.ok) throw new Error('Failed to fetch followers');
        const followers_list = await response.json();
        displayFollowersList(followers_list);
    } catch (error) {
        console.error('Error fetching followers:', error);
    }
}
async function fetchUserFollowing(user_id) {
    try {
        const response = await fetch(`profile/user/${user_id}/following`);
        if (!response.ok) throw new Error('Failed to fetch following');
        const following = await response.json();
        // console.log("Followings are : " ,following);
        displayFollowingList(following);
    } catch (error) {
        console.error('Error fetching following:', error);
    }
}




// Function to fetch user tweets
async function fetchUserTweets(user_id) {
    try {
        const response = await fetch(`profile/user/${user_id}/tweets`);
        if (!response.ok) throw new Error('Failed to fetch user tweets');
        const tweets = await response.json();
        // console.log("Tweets are : " ,tweets);
        displayUserTweets(tweets);
    } catch (error) {
        console.error('Error fetching user tweets:', error);
    }
}
function displayFollowersList(followers) {
    const followersList = document.querySelector('.followers-list');
    followersList.innerHTML = '';

    followers.forEach(follower => {
        const followerItem = document.createElement('div');
        followerItem.classList.add('follower-item', 'user-card');

        const followerInfo = `
            <div class="user-card">
                <div class="card-header">
                    <h3>${follower.username}</h3>
                </div>
                <div class="card-body">
                    <div class="img-class">
                        <img src="Media/images/${follower.profile_img}" alt="${follower.username}'s profile image" class="profile-img"> <br>
                    </div>
                    <strong>Full Name:</strong> ${follower.f_name} ${follower.l_name} <br>
                    <strong>Email:</strong> ${follower.user_email} <br>
                    <strong class=bio-content>Bio:</strong> ${follower.user_bio || 'No bio available'} <br>
                </div>
                <div class="card-footer">
                    <strong>Followed On:</strong> ${new Date(follower.followed_at).toLocaleDateString()} <br>
                </div>
            </div>
        `;

        // Set the inner HTML of the follower item
        followerItem.innerHTML = followerInfo;

        // Append the follower item to the followers list
        followersList.appendChild(followerItem);
    });
}




// Function to update following list
function displayFollowingList(following) {
    const followingList = document.querySelector('.following-list');
    followingList.innerHTML = '';

    following.forEach(user => {
        const followingItem = document.createElement('div');
        followingItem.classList.add('following-item', 'user-card');
        const userInfo = `
            <div class="user-card">
                <div class="card-header">
                    <h3>${user.username}</h3>
                </div>
                <div class="card-body">
                    <div class="img-class">
                        <img src="Media/images/${user.profile_img}" alt="${user.username}'s profile image" class="profile-img"> <br>
                    </div>
                    <strong>First Name:</strong> ${user.f_name} <br>
                    <strong>Last Name:</strong> ${user.l_name} <br>
                    <strong class="bio-content">Bio:</strong> <span class="bio-text">${user.user_bio || 'No bio available'}</span> <br>
                </div>
                <div class="card-footer">
                    <strong>Followed On:</strong> ${new Date(user.followed_at).toLocaleDateString()} <br>
                </div>
            </div>
        `;
        followingItem.innerHTML = userInfo;

        followingList.appendChild(followingItem);
    });
}
function displayUserTweets(tweets) {
    const tweetsList = document.querySelector('.tweets-list');
    tweetsList.innerHTML = '';

    tweets.forEach(tweet => {
        const tweetItem = document.createElement('article');
        tweetItem.classList.add('tweet-item');

        const tweetContent = document.createElement('p');
        tweetContent.classList.add('tweet-content');
        tweetContent.textContent = tweet.content;

        const tweetDate = document.createElement('small');
        tweetDate.classList.add('tweet-date');

        const utcDate = new Date(tweet.created_at);
        const timezoneOffset = utcDate.getTimezoneOffset();
        const localDate = new Date(utcDate.getTime() - timezoneOffset * 60000);
        tweetDate.textContent = localDate.toLocaleString();

        // Create the delete image button
        const deleteButton = document.createElement('img');
        deleteButton.classList.add('delete-tweet-image');
        deleteButton.src = '../icons/delete.png';
        deleteButton.alt = 'Delete Tweet';
        deleteButton.style.width = '20px';
        deleteButton.style.height = '20px';
        deleteButton.style.cursor = 'pointer';

        // Add click event to the delete button
        deleteButton.onclick = () => {
            const confirmed = confirm('Are you sure you want to delete this tweet?');
            if (confirmed) {
                deleteTweet(tweet.id);
            }
        };

        // Append elements to the tweet item
        tweetItem.appendChild(tweetContent);
        tweetItem.appendChild(tweetDate);
        tweetItem.appendChild(deleteButton);
        tweetsList.appendChild(tweetItem);
    });
}


// Function to open the modal and fetch user data
// Function to open the modal and fetch user data
async function openModal() {
    try {
        const response = await fetch('/profile/edit');
        const data = await response.json();
        console.log(data);

        const modal = document.createElement('div');
        modal.classList.add('modal');
        modal.style.display = 'block';
        modal.style.position = 'fixed';
        modal.style.top = '50%';
        modal.style.left = '50%';
        modal.style.transform = 'translate(-50%, -50%)';
        modal.style.background = 'white';
        modal.style.padding = '20px';
        modal.style.borderRadius = '10px';
        modal.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.2)';
        modal.style.width = '500px';

        // Create form elements
        const form = document.createElement('form');

        // Bio field
        const nameLabel = document.createElement('label');
        nameLabel.textContent = 'Bio:';
        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.value = data[0].user_bio || '';

        // Email field
        const emailLabel = document.createElement('label');
        emailLabel.textContent = 'Email:';
        const emailInput = document.createElement('input');
        emailInput.type = 'email';
        emailInput.value = data[0].user_email || '';

        // Append fields to the form
        form.appendChild(nameLabel);
        form.appendChild(nameInput);
        form.appendChild(document.createElement('br'));
        form.appendChild(emailLabel);
        form.appendChild(emailInput);
        form.appendChild(document.createElement('br'));

        // Create a submit button
        const submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.textContent = 'Save';
        form.appendChild(submitButton);

        modal.appendChild(form);
        document.body.appendChild(modal);

        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.remove();
            }
        });

        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            const updatedData = {
                bio: nameInput.value,
                email: emailInput.value,
            };

            console.log('Updated Data:', updatedData);

            try {
                const response = await fetch('profile/edit-data', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedData),
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                // const result = await response.json();
                location.reload();
                modal.remove();
            } catch (error) {
                console.error('Error updating profile:', error);
            }
        });

    } catch (error) {
        console.error('Error fetching user profile:', error);
    }
}

// Function to handle tweet deletion
async function deleteTweet(tweetId) {
    try {
        const response = await fetch(`profile/tweets/${tweetId}`, {
            method: 'DELETE',
        });

        // Log the response for debugging
        console.log('Response:', response);

        if (response.ok) {
            alert('Tweet deleted successfully!');
            // Reload the page
            location.reload();
        } else {
            console.error('Failed to delete tweet:', response.statusText);
            alert(`Failed to delete tweet. Status: ${response.status} - ${response.statusText}`);
        }
    } catch (error) {
        console.error('Error while deleting tweet:', error);
        alert('An error occurred while deleting the tweet.');
    }
}