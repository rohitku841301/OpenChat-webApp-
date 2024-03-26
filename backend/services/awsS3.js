// const AWS = require("@aws-sdk/client-s3");
const AWS = require("aws-sdk");

require("dotenv").config();


// const s3 = new S3Client({
//     credentials: {
//         accessKeyId:process.env.ACCESS_KEY,
//         secretAccessKey:process.env.SECRET_ACCESS_KEY
//     },
// })


exports.uploadToS3 = async (filename, data) =>{
    try {
      console.log("skdjn", filename, data);
      const BUCKET_NAME = process.env.BUCKET_NAME;
      const ACCESS_KEY = process.env.ACCESS_KEY;
      const SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY;
  
      const s3bucket = new AWS.S3({
        accessKeyId: ACCESS_KEY,
        secretAccessKey: SECRET_ACCESS_KEY,
      });
  
      var params = {
        Bucket: BUCKET_NAME,
        Key: filename,
        Body: data,
        ACL: "public-read",
      };
  
      const s3response = await s3bucket.upload(params).promise();
      console.log(s3response);
      console.log(s3response.Location);
      return s3response.Location;
    } catch (error) {
        console.log(error);
      return res.status(500).json({
        responseMessage: "Something Went Wrong",
      });
    }
  }