const multer = require('multer');
const path = require('path');
const Joi = require('joi');


const storage = (mediaType) => multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `Media/${mediaType}/`);
    },
    filename: (req, file, cb) => {
        const username = req.body.username_name; // Use the correct field name
        const timestamp = Date.now();
        const ext = path.extname(file.originalname);
        cb(null, `${username}_${timestamp}${ext}`);
    }
});


const imageFileFilter = (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    const validateSignupSchema = Joi.object({
        username_name: Joi.string().alphanum().min(3).max(30).required()
            .messages({
                'string.base': 'Username must be a string.',
                'string.alphanum': 'Username must be alphanumeric.',
                'string.min': 'Username must be at least 3 characters long.',
                'string.max': 'Username must be at most 30 characters long.',
                'string.empty': 'Username cannot be empty.',
            }),
        fname_name: Joi.string().min(3).max(50).required().regex(/^[A-Za-z]+$/)
            .messages({
                'string.base': 'First name must be a string.',
                'string.pattern.base': 'First name must contain only alphabetic characters.',
                'string.empty': 'First Name cannot be empty.',
            }),
        lname_name: Joi.string().min(1).max(100).required().pattern(/^[A-Za-z]+$/)
            .messages({
                'string.base': 'Last name must be a string.',
                'string.pattern.base': 'Last name must contain only alphabetic characters.',
                'string.empty': 'Last Name cannot be empty.',
            }),
        email_name: Joi.string().email().required()
            .messages({
                'string.base': 'Email must be a string.',
                'string.empty': 'Email cannot be empty.',
            }),
    });

    const { username_name, fname_name, lname_name, email_name } = req.body;

    const validationObject = {
        username_name,
        fname_name,
        lname_name,
        email_name,
    };

    const { error } = validateSignupSchema.validate(validationObject);
    
    if (error) {
        return cb(new Error(error.details[0].message));
    }

    if (!extname || !mimetype) {
        return cb(new Error('Not Valid: Only PNG, JPG, JPEG, GIF allowed.'));
    }
    cb(null, true);
};


const uploadImage = multer({
    storage: storage('images'),
    fileFilter: imageFileFilter,
    limits: { fileSize: 1024 * 1024 * 5 }
}).single('profile_img_name');


const validateImageUpload = (req, res, next) => {
    uploadImage(req, res, (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }
        next();
    });
};

module.exports = {
    validateImageUpload
};