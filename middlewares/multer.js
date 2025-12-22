const multer = require('multer');
const path = require('path');

const storage = multer.memoryStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/galeria');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '.webp');
    }
});

const upload = multer({ storage });
module.exports = { upload } ;