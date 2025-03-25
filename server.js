require('dotenv').config();
const conn = require('./Model/dbConfig');

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const cookieParser = require('cookie-parser');
const app = express();
const PORT = process.env.DEV_PORT || 3000;

// Set up View Engine and Static folder
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/Media/images', express.static((path.join(__dirname, 'Media/images'))));

// Session Middleware
app.use(cookieParser());
const sessionStore = new MySQLStore({}, conn);

app.use(session({
    key: 'user_session',
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 3600000, httpOnly: true }
}));




// Project Path Logging
console.log("✅ Project Static Folder:", path.join(__dirname, 'public/'));


// Controllers
const Authenticate = require("./routes/AuthRoute");
const Dashboard = require("./routes/DashboardRoute");
const Profile = require("./routes/ProfileRoute");



app.use((req, res, next) => {
    console.log(`📌 Incoming request from IP: ${req.ip} - ${req.method} ${req.url}`);
    next();
});


// Main Routes
app.use("/auth", Authenticate);
app.use("/dashboard", Dashboard);
app.use("/profile", Profile);


// Home Route
app.get("/", (req, res) => {
    const token = req.cookies.token;
    console.log(token);
    
    if (token) {
        return res.redirect("/dashboard");
    }

    res.render("index", { title: "Home Page" });
});


// Global Error Handler
app.use((err, req, res, next) => {
    console.error("🔥 Server Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
});




// Starting the server
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}/`);
});
