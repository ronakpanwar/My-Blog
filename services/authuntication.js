const JWT = require("jsonwebtoken");

const secret = "@villainRN$";

function createWebToken(user){
    const payload = {
        id:user._id,
        email:user.email,
        role:user.role,
    };
    
    const token = JWT.sign(payload , secret);
    return token;
}

function validateToken(token){
    const user = JWT.verify(token , secret);
    return user;
}

module.exports = {
    createWebToken,
    validateToken,
}