const {Schema, model}=require("mongoose");
const { createHmac, randomBytes } = require('crypto');
const { createTokenForUser } = require("../services/authentication");

const UserSchema=new Schema({
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
        required:true
    },
    profilImageUrl:{
        type:String,
        default:"/images/default.png"
    },
    role:{
        type:String,
        enum:["USER","ADMIN"],
        default:"USER"
    }
},{timestamps:true});

UserSchema.pre("save", function(next){
    const user=this;
    if(!user.isModified("password")) return null ;

    const salt=randomBytes(16).toString();
    const hashedPassword=createHmac("sha256",salt).update(user.password).digest("hex")
    console.log(hashedPassword);
    this.salt=salt;
    this.password=hashedPassword;
    next();
})

UserSchema.static("matchPasswordAndGenerateToken",async function(email,password){
    console.log(email,password);
    const user = await this.findOne({ email });
    if (!user){
        console.log("No User Found in the data");
        throw new Error("User Not Found");

    } 
    console.log('User found:', user);
    const salt = user.salt;
    const hashedPassword = user.password;
    // console.log('User-provided hash:', userProvidedHash);
    // console.log('Stored hashed password:', hashedPassword);
    const userProvidedHash = createHmac("sha256", salt)
    .update(password)
    .digest("hex");

    if (hashedPassword !== userProvidedHash) throw new Error("Wrong Password");

    const token=createTokenForUser(user);
    return token;
});

const User=model('user',UserSchema);

module.exports=User;