const express = require("express");
const router = express.Router();

// Data Passer Middlewares
const { validateImageUpload } = require('../Middlewares/uploadMiddleware');
const { Pass_Form_Data } = require('../Middlewares/formDataMiddleware');
const Tokenization  = require('../Middlewares/verifyTokenMiddleware');


const {
    SetPassword_Get, 
    SetPassword_Post,
    IndexLoginPage,
    LoginUser_Get,
    LoginUser_Post,
    LogoutUser,
} = require('../Controller/LoginFunction');

const { 
    SignupUserFunction_Get,
    SignupUserFunction_Post, 
    VerifyUser,
    Check_Token_Data,
} = require("../Controller/SignupFunctions");


router.get('/signup', SignupUserFunction_Get);
router.post('/signup-data', validateImageUpload, SignupUserFunction_Post);
router.get('/user-verification', VerifyUser)


router.get('/set-password', SetPassword_Get);
router.post('/set-password', Pass_Form_Data, SetPassword_Post);
router.get('/success', LoginUser_Get);
router.post('/login', Pass_Form_Data, LoginUser_Post);
router.get("/main-login", IndexLoginPage);


router.get('/logout', LogoutUser);



module.exports = router