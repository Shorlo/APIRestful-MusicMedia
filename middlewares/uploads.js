// Multer config to upload files
const multer = require('multer');
const storage = multer.diskStorage
({
     destination: (request, file, cb) =>
     {
          cb(null, './uploads/profileImage/');
     },
     filename: (request, file, cb) =>
     {
          cb(null, 'profileImage-'+Date.now()+'-'+file.originalname);
     }
});
const uploads = multer({storage});

module.exports = uploads;