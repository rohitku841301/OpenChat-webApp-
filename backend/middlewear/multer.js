// const multer = require("multer");

// console.log("check");



const multer = require("multer");
const path = require("path");
const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = upload;


// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     const destinationPath = path.join(__dirname, "../uploads");
//     console.log("Destination path:", destinationPath);
//     return cb(null, "./uploads");
//   },
//   filename: function (req, file, cb) {
//     console.log("File object:", file);
//     return cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// module.exports = multer({
//   storage: storage,
// });
