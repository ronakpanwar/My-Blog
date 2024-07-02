require('dotenv').config();
const express = require('express');
const path = require('path');
const { connectMongoDb } = require('./connection');
const userRoute = require('./routes/user');
const blogRoute = require('./routes/blog')
const cookieParser = require('cookie-parser');
const { cheakCookieForUser } = require('./midlewere/authontication');
const Blog = require('./models/blog');
const mongoose  = require('mongoose');

const app = express();


app.set('view engine' , 'ejs');
app.set("views", path.resolve('./views') );
const PORT  = process.env.PORT || 8000;


app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(cheakCookieForUser('token'));
app.use(express.static(path.resolve('./public'))); 

mongoose.connect(process.env.MONGO_URL).then(() => 
    console.log("mongo is connected")
).catch((err) => {
    console.log({err:err});
});

app.get('/',async (req, res)=>{

    const allBlogs = await Blog.find({});
    return res.render('home',{
        user:req.user,
        blogs:allBlogs,
    });
})

app.use('/user' , userRoute); 
app.use('/blog' , blogRoute);


app.listen(PORT , ()=>{console.log("app start on localhost:8000")});