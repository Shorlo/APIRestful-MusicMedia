// Multer config to upload files
const multer = require('multer');

const storage = multer.diskStorage
({
     destination: (request, file, cb) =>
     {
          cb(null, './uploads/artistImage/');
     },
     filename: (request, file, cb) =>
     {
          cb(null, 'artistImage-'+Date.now()+'-'+file.originalname);
     }
});

const uploads = multer({storage});

module.exports = uploads