import { getAccessTokenFromHeaders, isTokenIncluded } from "../../helpers/auth/tokenHelpers.js";
import CustomError from '../../helpers/error/CustomError.js'
import jwt from 'jsonwebtoken'
import User from "../../models/User.js";
import asyncErrorWrapper from "../../helpers/error/asyncErrorWrapper.js";


//Geçerli bir token mı onu kontrol eden middleware
export const getAccessToRoute = asyncErrorWrapper(async (req, res, next) => {

    //Token
    //console.log(req.headers.authorization);
    const { JWT_SECRET_KEY } = process.env;

    if (!isTokenIncluded(req)) {
        //401 Unauthorized : Giriş yapmadan sayfaya erişmeye çalımak
        //403 Forbidden : Giriş olsa bile yetkimiz olmayan yere erişmeye çalışmak
        next(new CustomError("You are not authorized to access this route", 401))
    }

    const accessToken = getAccessTokenFromHeaders(req);

    jwt.verify(accessToken, JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            next(new CustomError("You are not authorized to access token", 401))
        }
        //Bu middleware fonksiyon kullanılan routerda req üzerinedeki user objesine jwt üzerinde çözülmüş id ve name i ekler 
        //ve router üzerinde kullanılan tüm fonksiyonlardan erişilebilmeyi sağlar 
        req.user = {
            id: decoded.id,
            name: decoded.name
        }

        //console.log(decoded);
        next();
    })
})


export const getAdminAccess = asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.user;
    //istersek jwt üzerine payload olarak role bilgisini de girirerek tekrar sorgu atmaktan kurtuladabiliriz
    //giriş yapan kullanıcının id bilgisine göre kullanıcı bilgilerini aldık
    const user = await User.findById(id);
    //admin mi diye sorguladık değilse 403 Forbidden hatası attık
    if (user.role !== 'admin') {
        return next(new CustomError("Only admin accesss to route", 403))
    }

    next();
})