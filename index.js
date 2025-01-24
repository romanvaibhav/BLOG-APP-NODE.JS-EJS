const express=require("express");
const ejs=require("ejs");
const mongoose=require("mongoose");
const path=require('path');
const app=express();
const PORT=8000;

mongoose.connect("mongodb://localhost:27017/blogify")
.then(() => {
  console.log("MongoDb connected");
})
.catch((err) => console.log("Error connecting to MongoDB:", err));

app.use(express.json());
app.use(express.urlencoded({extended:false}));
const userRouter=require("./routes/user");

app.set("view engine","ejs");
app.set("views",path.resolve("./views"));

app.get("/",(req,res)=>{
    return res.render('home.ejs');
})
app.use("/user",userRouter);

app.listen(PORT,()=>console.log(`Server Started at ${PORT}`));