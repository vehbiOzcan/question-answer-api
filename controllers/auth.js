import User from "../models/User.js";
import asyncErrorWrapper from "../helpers/error/asyncErrorWrapper.js";
import { sendJwtToClient } from "../helpers/auth/tokenHelpers.js";
import { comparePassword, validateUserInput } from "../helpers/input/inputHelpers.js";
import CustomError from "../helpers/error/CustomError.js";
import sendmail from "../helpers/libraries/sendMail.js";

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

    const user = await User.findOne({ email }).selected("+password"); //db den mail e göre kullanıcıyı çekiyoruz 
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

const imageUpload = asyncErrorWrapper(async (req, res, next) => {
    //user id mize (getAccessRoute tan gelen) göre kullanıcımızı bulduk 
    //ardından profile_image alanını profileImageUploads midd. dan gelen savedProfileImage ile güncelledik 
    const user = await User.findByIdAndUpdate(req.user.id,{
        profil_image:req.savedProfileImage
    },{
        //yeni kullanıcı bilgilerini dönmesi ve validasyonların aktif kalmasını ayarladık
        new:true,
        runValidators:true
    })
    
    res.status(200).json({
        success: true,
        message:"Profile image successfull",
        data: user
    })
})


//Forgot password
const forgotPassword = asyncErrorWrapper(async (req,res,next) => {
    const resetEmail = req.body.email
    
    //email ile kullanıcı var mı arıyoruz varsa alıyoruz 
    const user = await User.findOne({email:resetEmail});

    //user var mı kontrol ettik
    if(!user){
        return next(new CustomError("There is no user with that email",400));
    }

    //resetPasswordToken imizi user üzerine kayıt ettiğimiz metot ile ürettik 
    const resetPasswordToken = await user.generateResetPasswordToken();

    await user.save();
    //reset tokenımıızı url mize query parametre olarak  ekleyip resetpassword routuna yönlendirdik
    const resetPassworUrl = `http://localhost:5000/api/auth/resetpassword?resetPasswordToken=${resetPasswordToken}`;
    //emailimiz bir html göndereceği için templatenini ve reset urlsine gönderen liniki oluşturduk
    const emailTemplate = `
    <h3>Reset Password Link</h3>
    <p> This <a href='${resetPassworUrl} target = '_blank'>Reset Link</a> active 1 hour. </p>  
    `; 

    try { 
        //Oluşturduğumuz mail gönderme helperını import edip mailOption larımızı girdik  
        await sendmail({
            from:process.env.SMTP_USER, //kimden?
            to:resetEmail, //Kime?
            subject:'Reset Your Email', //Mail başlığı
            html: emailTemplate //mail mi yoksa html mi html ise templatini girdik
        });
        res.status(200).json(
            {
                success:true,
                message:"Reset password send your email"
            }
        )
        
    } catch (err) {
        //E- maiil gönderilmediyse ilgili alanları user üzerinden sıfır-lamamız gerekiyor çünkü bu token işe yaramayacak
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        //sıfırlayıp kayıt ediyoruz
        await user.save();

        return next(new CustomError("Email could not be send",500));
    }

})

//Reset Password
const resetPassword = asyncErrorWrapper(async (req,res,next)=> {
    //forgot pasword üzerinden mail ile gönderdiğimiz likin yönlendirdiği routa eklediğimiz query parametresini aldık :D 
    const {resetPasswordToken} = req.query;
    const {password} = req.body //yeni passwordumuzu aldık

    console.log(resetPasswordToken,password)
    //token yoksa hata döndük
    if(!resetPasswordToken){
        next(new CustomError("Please provide a valid token"), 400)
    }

    //token varsa kulanıcı içerinde aradık 
    const user = await User.findOne({
        resetPasswordToken:resetPasswordToken, //resetPasword tokenı eşit olan kişinin bilgilerini
        resetPasswordExpire: {$gt : Date.now()} //password tokenının expire süresi şimdiki zamandan büyükse alır
    })
    //kullanıcının tokeni yoksa yada expire olmuşsa hata fırlattık
    if(!user){
        next(new CustomError("Invalid token or session expired", 404))
    }
    //Hiç bir sorun yoksa passwordunu güncelledik ve token kısımlarını sıfırladık
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save(); //kayıt ettik 
    //responsumuzu döndük
    res
    .status(200)
    .json({
        success:true,
        message:"Reset password process successfull"
    })

}) 

const resetPasswordPage = asyncErrorWrapper(async (req,res,next)=> {
    //forgot pasword üzerinden mail ile gönderdiğimiz likin yönlendirdiği routa eklediğimiz query parametresini aldık :D 
    let {resetPasswordToken} = req.query;
    resetPasswordToken = resetPasswordToken.split(" ")[0]
    const {password} = req.query //yeni passwordumuzu aldık

    console.log(resetPasswordToken,password)
    //token yoksa hata döndük
    if(!resetPasswordToken){
        next(new CustomError("Please provide a valid token"), 400)
    }

    //token varsa kulanıcı içerinde aradık 
    const user = await User.findOne({
        resetPasswordToken:resetPasswordToken, //resetPasword tokenı eşit olan kişinin bilgilerini
        resetPasswordExpire: {$gt : Date.now()} //password tokenının expire süresi şimdiki zamandan büyükse alır
    })
    //kullanıcının tokeni yoksa yada expire olmuşsa hata fırlattık
    if(!user){
        next(new CustomError("Invalid token or session expired", 404))
    }
    //Hiç bir sorun yoksa passwordunu güncelledik ve token kısımlarını sıfırladık
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save(); //kayıt ettik 
    //responsumuzu döndük
    console.log("success ")
    res
    .status(200)
    .json({
        success:true,
        message:"Reset password process successfull"
    })

}) 


//(Denemek için bir amacı yok) Bu hatayı fırlattığımız zaman custom error handlerımız yakalıyor
const errorTest = (req, res, next) => {
    //some code
    throw new Error("Bir hata oluştu")
    //some code
}



const AuthController = { register, errorTest, tokenTest, getUser, login, logout, imageUpload, forgotPassword,resetPassword, resetPasswordPage }

export default AuthController;