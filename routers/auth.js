import express  from "express";
//Controllers
import AuthController from "../controllers/auth.js";
import { getAccessToRoute } from "../middlewares/auth/auth.js";
import profileImageUpload from "../middlewares/libraries/profileImageUploads.js";

const auth = express.Router();

auth.post("/register",AuthController.register)
auth.get("/error",AuthController.errorTest)

//Token kontrolü yapan route deneme fonksiyonu
auth.get("/tokentest",getAccessToRoute,AuthController.tokenTest) //Token lazım olan routelara uyguluyoruz

auth.get("/profile",getAccessToRoute,AuthController.getUser) //Tokenımız ile userımızı getiriyoruz
auth.post("/login",AuthController.login) 
auth.get("/logout",getAccessToRoute,AuthController.logout) // Burada da token varmı kontrol etmemiz gerekiyor varsa çıkışı sağlayacağız

auth.post("/forgotpassword",AuthController.forgotPassword); //password unutulma yada yenileme işleminde kullanılacak
auth.put("/resetpassword",AuthController.resetPassword); //ASıl kullanıclacak olan kısım budur.
auth.get("/resetpasswordpage",AuthController.resetPasswordPage);
auth.get("/resetpassword", (req,res,next) => {
    const {resetPasswordToken} = req.query;
    res.send(`
        <h1>Reset Password Page</h1></br>
        <form method='GET' action='http://localhost:5000/api/auth/resetpasswordpage?resetPasswordToken=${resetPasswordToken}'>
            <input type='password' name='password' id='password'/>
            <input name='resetPasswordToken' id='resetPasswordToken' value='${resetPasswordToken}' hidden/>
            <input type='submit'/>
        </form>
    `)
})
auth.post("/upload",[getAccessToRoute,profileImageUpload.single("profile_image")],AuthController.imageUpload) //multer ile oluşturduğumuz profileImageUpload middlewaremızı dahil ettik 
export default auth;