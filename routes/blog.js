const {Router} = require("express");
const multer = require('multer');
const path = require('path');
const Blog = require('../models/blog')
const Comment = require('../models/comment')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(`./public/uploads/`));
    },
    filename: function (req, file, cb) {
        const filename = `${Date.now()}-${file.originalname}`;
        cb(null,filename);
    }
  })

  const upload = multer({ storage: storage });


const router = Router();

router.get('/add-blog' , (req,res)=>{
    return res.render('addBlog' , {
        user:req.user,
    })
});

router.post('/comment/:blogId' , async(req,res)=>{
    const comment = await Comment.create({
        content:req.body.content,
        blogId:req.params.blogId,
        createdBy:req.user.id,
    })
    res.redirect(`/blog/${req.params.blogId}`);
})

router.get('/:id' , async(req,res)=>{
    const blog = await Blog.findById(req.params.id).populate("createdBy");
    const comments = await Comment.find({blogId:req.params.id}).populate("createdBy");
    return res.render('blog' ,{
        user:req.user,
        blog,
        comments,
    }     
    )
})

router.post('/', upload.single('coverImgUrl'), async(req,res)=>{
    const {title , body}= req.body;
    const blog = await Blog.create({
       title,
       body,
       coverImgUrl: `/uploads/${req.file.filename}`,
      createdBy: req.user.id,
    })
  
    res.redirect('/');
})


module.exports = router;