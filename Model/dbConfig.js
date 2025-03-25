// Connecting to database

const mysql = require("mysql2");

const conn = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});

conn.connect((error) => {
    if (error) {
        console.error("❌ Database Connection Failed!");
        console.error("Error Code:", error.code);
        console.error("Error Message:", error.message);
        console.error("Error Stack:", error.stack);
        process.exit(1);
    } else {
        console.log("✅ Database Connected Successfully..!!");
    }
});

module.exports = conn;