const jwt = require('jsonwebtoken');
const secret_key = process.env.JWT_SECRET_KEY;

const Tokenization = (req, res, next) => {
    console.log("Inside Tokenization Process......!");
    console.log("----------------------------------------------");

    const token = req.cookies.token;

    if (!token) {
        console.log("No Token Found in the Cookies");
        console.log("----------------------------------------------");
        res.redirect('auth/main-login');
    }

    jwt.verify(token, secret_key, (err, decoded) => {
        if (err) {
            console.error("Token verification error:", err);
            console.log("----------------------------------------------");
            return res.status(401).send({ message: 'Unauthorized! Invalid token.' });
        }

        // console.log(decoded);
        email = decoded.email;
        fname = decoded.firstName;
        lname = decoded.lastName;

        console.log("Token verification of User Data is : ", email, fname, lname);
        console.log("----------------------------------------------");
        next();
    });
};

module.exports = Tokenization;