const express=require("express");
const ejs=require("ejs");
const mongoose=require("mongoose");
const path=require('path');
const app=express();
const PORT=8000;
const cookieParser=require("cookie-parser")
const  {checkForAuthenticationCookie} = require("./middlewares/authentication");
const userRouter=require("./routes/user");
const blogRouter=require("./routes/blog");
const Blog=require("./models/blog");


mongoose.connect("mongodb://localhost:27017/blogify")
.then(() => {
  console.log("MongoDb connected");
})
.catch((err) => console.log("Error connecting to MongoDB:", err));

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")))

app.set("view engine","ejs");
app.set("views",path.resolve("./views"));

app.get("/",async(req,res)=>{
  const allblogs=await Blog.find({}).sort({createdAt:-1});
    return res.render('home.ejs',{
      user:req.user,
      blogs:allblogs,
    });
})

app.use("/user",userRouter);
app.use("/blog",blogRouter);

app.listen(PORT,()=>console.log(`Server Started at ${PORT}`));