const { validateToken } = require("../services/authuntication");

function cheakCookieForUser(cookieName){
     return (req,res,next)=>{
        const token = req.cookies[cookieName];
        if(!token) return next();

        const user = validateToken(token);
        if(!user) return next();

        req.user = user;
        next();
     }
}

module.exports = {
    cheakCookieForUser,

}