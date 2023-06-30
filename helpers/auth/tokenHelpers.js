export const sendJwtToClient = (user, res) => {
    //Generate Token
    const token = user.generateJwtFromUser(); //Usera token üretiyoruz

    const { JWT_COOKIE, NODE_ENV } = process.env;

    res
        .status(200)
        .cookie("access_token", token, {
            expires: new Date(Date.now() + parseInt(JWT_COOKIE) * 1000 * 60), //ms yi saniyeye çevirdik
            httpOnly: true,
            secure: NODE_ENV === "development" ? false : true
        })
        .json({
            succes: true,
            access_token: token,
            data: {
                name: user.name,
                email: user.email
            }
        })
}

//Token requeste (req) yerleştirilmiş mi yerleştirilmemiş mi kontrol eden fonksiyon
export const isTokenIncluded = (req) => {
    return req.headers.authorization && req.headers.authorization.startsWith("Bearer:")
}

//Token'ı Headers'tan Bearer kısmını ayırıp alan fonksiyon 
export const getAccessTokenFromHeaders = (req) => {

    const authorization = req.headers.authorization;
    const access_token = authorization.split(" ")[1]; //Bearer: <access_token>   formatında olduğu için " " 'a göre parçaladık

    return access_token;
}

