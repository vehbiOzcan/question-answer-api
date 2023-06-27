import jwt from 'jsonwebtoken';

export const sendJwtToClient = (user, res) => {
    //Generate Token
    const token = user.generateJwtFromUser();

    const { JWT_COOKIE, NODE_ENV } = process.env;

    res
        .status(200)
        .cookie("access_token", token, {
            expires: new Date(Date.now() + parseInt(JWT_COOKIE) * 1000), //ms yi saniyeye çevirdik
            httpOnly: true,
            secure: NODE_ENV === "development" ? false : true
        })
        .json({
            succes:true,
            access_token:token,
            data:{
                name:user.name,
                email:user.email
            }
        })

}