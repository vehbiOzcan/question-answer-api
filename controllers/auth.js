import User from "../models/User.js";
import asyncErrorWrapper from "../helpers/error/asyncErrorWrapper.js";
import { sendJwtToClient } from "../helpers/auth/tokenHelpers.js";
import { comparePassword, validateUserInput } from "../helpers/input/inputHelpers.js";
import CustomError from "../helpers/error/CustomError.js";

const register = asyncErrorWrapper(async (req, res, next) => {
    //Post Data 
    // const name = "Zahide Yücel Özcan";
    // const email = "ozcans@gmail.com";
    // const password = "123456";

    const { name, email, password, role } = req.body;

    const user = await User.create({
        name,
        email,
        password,
        role
    });

    sendJwtToClient(user, res);

    //async işlemlerdeki hataları yakalamk için try - catch yapısı kullanılır
    //ve catch içerisinde hata return next(err) diyerek errorHandler'a gönderilir
    //Bu şekilde try-catch blokları ile yapmak oldukça zahmetli bu yüzden express-async-handler paketini kullanıyoruz
    // try {
    //     //async, await
    //     const user = await User.create({
    //         name,
    //         email,
    //         password
    //     });

    //     res
    //         .status(200)
    //         .json({
    //             success: true,
    //             data: user
    //         })
    // } catch (err) {
    //     return next(err);
    // }
});

const tokenTest = (req, res, next) => {
    res.json({
        success: true,
        message: "Welcome"
    })
}

const getUser = asyncErrorWrapper(async (req, res, next) => {
    res.json({
        success: true,
        //middleware/uth/auth.js içerisinde yazdığımız getAccessToRoute fonkisyondan req.user üzerine kaydedilen decoded bilgileri
        data: {
            id: req.user.id,
            name: req.user.name
        }
    });
})

const login = asyncErrorWrapper(async (req, res, next) => {

    const { email, password } = req.body;

    if (!validateUserInput(email, password)) { //inputlar girilmişmi diye kontrol ediyoruz 
        return next(new CustomError("Please check your input", 400))
    }

    const user = await User.findOne({ email }).select("+password"); //db den mail e göre kullanıcıyı çekiyoruz 
    //console.log(user);

    if (!comparePassword(password, user.password)) { //kullanıcının girdiği password ile dbdeki hashlenmiş password aynı mı diye bakıyoruz 
        return next(new CustomError("Please check your credentials", 400));
    }

    sendJwtToClient(user, res); //hashlenmiş password doğru ise token ımızı ve user bilgilerini istemciye gönderiyoruz

});

const logout = asyncErrorWrapper(async (req, res, next) => {

    const { NODE_ENV } = process.env;

    return res.status(200).cookie({
        httpOnly:true,
        expires:new Date(Date.now), //zamanı şimdi yaptığımız için silindi
        secure: NODE_ENV === "development" ? false : true
    }).json({
        success:true,
        message:"Logout successfully"
    })
})

//(Denemek için bir amacı yok) Bu hatayı fırlattığımız zaman custom error handlerımız yakalıyor
const errorTest = (req, res, next) => {
    //some code
    throw new Error("Bir hata oluştu")
    //some code
}


const AuthController = { register, errorTest, tokenTest, getUser, login, logout }

export default AuthController;