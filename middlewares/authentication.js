const {validateToken}=require("../services/authentication")

function checkForAuthenticationCookie(cookieName){
     return (req,res,next)=>{
        const tokenCookiesValue=req.cookies[cookieName];
        if(!tokenCookiesValue){
            return next()
        }

        try{
            const userPayload=validateToken(tokenCookiesValue);
            req.user=userPayload;
        }
        catch(err){
            console.error("Invalid token:", err.message);
        }
        return next();
    };
}

module.exports={
    checkForAuthenticationCookie,
}


