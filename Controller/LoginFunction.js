const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const dbQueries = require('../Model/dbQueryLoginFunctions');

const SetPassword_Get = async (req, res) => {
    const email = req.query.email;
    res.render('signup/set-password', { email });
};

const SetPassword_Post = async (req, res) => {
    const { email, password } = req.body;

    console.log("Received email:", email);
    console.log("Received password:", password);

    if (!email || !password) {
        return res.status(400).json({ ok: false, message: "Email and password are required." });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const results = await dbQueries.updateUserPassword(email, hashedPassword);

        if (results.affectedRows > 0) {
            res.json({ ok: true, message: "Password set successfully!" });
        } else {
            res.status(400).json({ ok: false, message: "Email not found or password not updated." });
        }
    } catch (error) {
        console.error("Error setting password:", error);
        res.status(500).json({ ok: false, message: "Internal Server Error" });
    }
};

const IndexLoginPage = (req, res) => {
    res.render('login/main_login')
};

const LoginUser_Get = (req, res) => {
    res.render('login/password-set-success', { email: req.query.email });
}

const LoginUser_Post = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if user exists
        const results = await dbQueries.findUserByUsernameOrEmail(username);

        if (results.length === 0) {
            return res.status(400).json({ ok: false, message: "Invalid username or password." });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ ok: false, message: "Invalid username or password." });
        }

        // Generate JWT Token
        const tokenPayload = {
            id: user.id,
            email: user.user_email,
            firstName: user.f_name,
            lastName: user.l_name,
        };

        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

        // Set token in cookies
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 3600000, // 1 hour
        });

        // Store session data
        req.session.userId = user.id;
        req.session.username = user.username;
        req.session.token = token;

        // Ensure session is saved before responding
        req.session.save(async (err) => {
            if (err) {
                console.error("Session save error:", err);
                return res.status(500).json({ ok: false, message: "Session save failed" });
            }

            // Insert or update session in database
            await dbQueries.insertOrUpdateSession(user.id, req.sessionID);

            return res.json({ ok: true, message: "Login successful!", sessionId: req.sessionID });
        });

    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({ ok: false, message: "Internal Server Error" });
    }
};

const LogoutUser = async (req, res) => {
    if (!req.session.userId) {
        return res.status(400).json({ ok: false, message: "User  not logged in." });
    }

    try {
        await dbQueries.updateSessionStatus(req.session.userId);

        req.session.destroy((err) => {
            if (err) {
                console.error("Error during logout:", err);
                return res.status(500).json({ ok: false, message: "Internal Server Error" });
            }
            res.clearCookie('token');
            res.clearCookie('connect.sid');
            return res.redirect('/');
        });
    } catch (error) {
        console.error("Error during logout:", error);
        return res.status(500).json({ ok: false, message: "Internal Server Error" });
    }
};


module.exports = {
    SetPassword_Get,
    SetPassword_Post,
    LoginUser_Get,
    LoginUser_Post,
    LogoutUser,
    IndexLoginPage,
}