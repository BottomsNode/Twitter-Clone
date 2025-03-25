const conn = require('./dbConfig');

// Function to update user's password and status
const updateUserPassword = async (email, hashedPassword) => {
    const query = "UPDATE users_tbl SET password = ?, is_active = 1, is_user_verified = 1, modified_at = UTC_TIMESTAMP() WHERE user_email = ?";
    const values = [hashedPassword, email];
    const [results] = await conn.promise().query(query, values);
    return results; // Return the results for further checks
};

// Function to find a user by username or email
const findUserByUsernameOrEmail = async (username) => {
    const query = "SELECT * FROM users_tbl WHERE username = ? OR user_email = ?";
    const [results] = await conn.promise().query(query, [username, username]);
    return results;
};

// Function to insert or update a session
const insertOrUpdateSession = async (userId, sessionId) => {
    const query = `
        INSERT INTO session_tbl (user_id, session_id, login_time) 
        VALUES (?, ?, UTC_TIMESTAMP())`;
    const values = [userId, sessionId];
    await conn.promise().query(query, values);
};

// Function to update session status on logout
const updateSessionStatus = async (userId) => {
    const query = "UPDATE session_tbl SET status='Inactive', logout_time = UTC_TIMESTAMP() WHERE user_id = ?";
    const values = [userId];
    await conn.promise().query(query, values);
};

module.exports = {
    updateUserPassword,
    findUserByUsernameOrEmail,
    insertOrUpdateSession,
    updateSessionStatus,
};