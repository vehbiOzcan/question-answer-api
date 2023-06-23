import User from "../models/User.js";
import asyncErrorWrapper from "../helpers/error/asyncErrorWrapper.js";

const register = asyncErrorWrapper(async (req, res, next) => {
    //Post Data 
    const name = "Zahide Yücel Özcan";
    const email = "ozcans@gmail.com";
    const password = "123456";

    const user = await User.create({
                name,
                email,
                password
            });
    
            res
                .status(200)
                .json({
                    success: true,
                    data: user
                })

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

//(Denemk için bir amacı yok) Bu hatayı fırlattığımız zaman custom error handlerımız yakalıyor
const errorTest = (req, res, next) => {
    //some code
    throw new Error("Bir hata oluştu")
    //some code
}

const AuthController = { register, errorTest }

export default AuthController;