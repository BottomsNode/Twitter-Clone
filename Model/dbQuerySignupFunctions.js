const conn = require('./dbConfig');

// Function to check if a user exists by username or email
const checkExistingUser = async (username, email) => {
    const query = "SELECT * FROM users_tbl WHERE username = ? OR user_email = ?";
    const [results] = await conn.promise().query(query, [username, email]);
    return results;
};

// Function to insert a new user
const insertUser = async (userData) => {
    const query = `
        INSERT INTO users_tbl (username, f_name, l_name, user_bio, user_email, profile_img, timezone, created_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, UTC_TIMESTAMP())`;
    const values = [
        userData.username,
        userData.fname,
        userData.lname,
        userData.bio,
        userData.email,
        userData.profileImg,
        userData.timezone
    ];
    await conn.promise().query(query, values);
};

// Function to get user verified
const updateEmailVerificationStatus = async (email) => {
    const query = "UPDATE users_tbl SET is_email_verified = 1, modified_at = UTC_TIMESTAMP() WHERE user_email = ?";
    const values = [email];
    const [results] = await conn.promise().query(query, values);
    return results; // Return the results for further checks
};


module.exports = {
    checkExistingUser,
    updateEmailVerificationStatus,
    insertUser,
};