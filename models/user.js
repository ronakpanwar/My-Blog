    const mongoose = require('mongoose');
const {createWebToken , validateToken} = require("../services/authuntication")
const { randomBytes , createHmac } = require('crypto');

const userSchema = new mongoose.Schema({
    fullName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    salt:{
        type:String,
       
    },
    password:{
        type:String,
        required:true,
    },
    profileImageUrl:{
         type:String,
        default:"/images/user.png",
    },
    role:{
        type:String,
        enum:["ADMIN", "USER"],
        default:"USER",
    },
}, {timestamps:true});

userSchema.pre("save", function(next){
    const user = this;

    if(!user.isModified('password')) return ;

    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac('sha256',salt).update(user.password).digest('hex');
    
    this.salt = salt;
    this.password = hashedPassword;

    next();
})

userSchema.static("matchPasswordAndGenrateToken" ,async function (email, password){
    const user =await this.findOne({email});
    if(!user)throw new Error('user not found');

    const salt = user.salt;
    const hashPassword = user.password;
    
    const userProvidPassword = createHmac('sha256',salt).update(password).digest('hex');
    if(hashPassword !== userProvidPassword) throw new Error("password is incorect");

    const token = createWebToken(user);
    return token;
})


const User = mongoose.model('users', userSchema);

module.exports = User;