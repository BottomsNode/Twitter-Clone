const multer = require('multer');
const multerData = multer();

// Only Text data will be sent to the server

module.exports = {
    Pass_Form_Data: multerData.none(),
};