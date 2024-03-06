require("dotenv").config();
const jwt = require("jsonwebtoken");

exports.authentication = async(req,res,next)=>{
    const headerToken = req.headers.authorization;
    jwt.verify(headerToken,process.env.JWT_SECRET, (err,decode)=>{
        if(err){
            res.status(401).json({
                reponseMessage:"token verification failed",
                success:false
            })
        }else{
            console.log(decode);
            res.user = decode
        }
    })
}