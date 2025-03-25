const jwt = require('jsonwebtoken');

const dbQueries = require('../Model/dbQuerySignupFunctions')



const SignupUserFunction_Get = (req, res) => {
    const token = req.cookies.token;
    console.log(token);

    if (token) {
        return res.redirect("/dashboard");
    }

    res.render("signup/signup", { title: "Signup Page" });
};


const SignupUserFunction_Post = async (req, res) => {
    const bodyData = req.body;
    const fileData = req.file;

    console.log("Body is:", bodyData);
    console.log("File is:", fileData);

    if (!fileData) {
        return res.status(400).json({ ok: false, message: "Profile image is required." });
    }

    try {
        // Verify if the email or username is already in use
        const existingUser = await dbQueries.checkExistingUser(bodyData.username_name, bodyData.email_name);

        if (existingUser.length > 0) {
            return res.status(400).json({ ok: false, message: "Username or email already exists." });
        }

        // Generate token for email verification
        const token = jwt.sign({ email: bodyData.email_name }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
        console.log("Token Created ", token);
        const link = `user-verification?link=${encodeURIComponent(token)}`;
        console.log("Email Verification Link ", link);

        // Prepare user data for insertion
        const userData = {
            username: bodyData.username_name,
            fname: bodyData.fname_name,
            lname: bodyData.lname_name,
            bio: bodyData.bio_name,
            email: bodyData.email_name,
            profileImg: fileData.filename,
            timezone: bodyData.timezone_name
        };

        // Insert the new user
        await dbQueries.insertUser(userData);
        return res.json({ ok: true, link: link, message: "Signup successful! Please check your email to verify." });
    } catch (error) {
        console.error("Error saving user data:", error);
        return res.status(500).json({ ok: false, message: "Internal Server Error" });
    }
};


const VerifyUser = async (req, res) => {
    const token = req.query.link;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const email = decoded.email;

        const results = await dbQueries.updateEmailVerificationStatus(email);

        if (results.affectedRows > 0) {
            res.render('signup/verifying', { email: email, message: "The Verification is successful." });
        } else {
            throw new Error("Email verification failed.");
        }
    } catch (error) {
        console.error("Error verifying token:", error);
        res.status(400).render('error', { message: "The verification link is invalid or has expired." });
    }
};



module.exports = {
    SignupUserFunction_Get,
    SignupUserFunction_Post,
    VerifyUser,
};