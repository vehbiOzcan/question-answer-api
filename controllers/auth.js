import User from "../models/User.js";
import asyncErrorWrapper from "../helpers/error/asyncErrorWrapper.js";
import { sendJwtToClient } from "../helpers/auth/sendJwtToClient.js";

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
    
    sendJwtToClient(user,res);

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

//(Denemek için bir amacı yok) Bu hatayı fırlattığımız zaman custom error handlerımız yakalıyor
const errorTest = (req, res, next) => {
    //some code
    throw new Error("Bir hata oluştu")
    //some code
}

const AuthController = { register, errorTest }

export default AuthController;