const {Router}=require('express');
const multer  = require('multer')
const path=require("path")
const router=Router();
const Blog=require("../models/blog")
const Comment=require("../models/comment")



const storage=multer.diskStorage({
    destination: function(req,file,cb){
        return cb(null, path.resolve(`./public/uploads/`));
    },
    filename: function(req,file,cb){
        return cb(null,`${Date.now()}-${file.originalname}`);
    }
})

const upload=multer({storage:storage});


router.get("/add-new",(req,res)=>{
    return res.render("addBlog",{
        user:req.user
    })
});
router.get("/:id",async(req,res)=>{
    const blog=await Blog.findById(req.params.id).populate("createdBy");
    const comment=await Comment.find({blogId: req.params.id}).populate("createdBy");
    console.log(blog);
    return res.render("blog",{
        user:req.user,
        blog,
        comment
    })
})

router.post("/comment/:blogId",async(req,res)=>{
    await Comment.create({
        content:req.body.content,
        blogId:req.params.blogId,
        createdBy:req.user._id,
    })
    return res.redirect(`/blog/${req.params.blogId}`);
})

router.post("/",upload.single("coverImage"),async(req,res)=>{
    const {title,body}=req.body;
    console.log(req.body);
    console.log(req.file);
    const blog=await Blog.create({
        body,
        title,
        createdBy:req.user._id,
        coverImageURL:`/uploads/${req.file.filename}`
    })

    return res.redirect(`/blog/${blog._id}`);
})


module.exports=router;
