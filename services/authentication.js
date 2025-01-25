const JWT=require("jsonwebtoken");

const secret="$uperman@123";

function createTokenForUser(user){
    payload={
        _id:user._id,
        email:user.email,
        profilImageUrl:user.profilImageUrl,
        role:user.role
    }

    const token=JWT.sign(payload,secret);

    return token;
}

function validateToken(token){
    if(!token) return null;
    try{
        const payload= JWT.verify(token,secret);
        return payload;
    }
    catch(error){
        return null;
    }
}

module.exports={
    createTokenForUser,
    validateToken
}