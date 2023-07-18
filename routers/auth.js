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

auth.post("/upload",[getAccessToRoute,profileImageUpload.single("profile_image")],AuthController.imageUpload) //multer ile oluşturduğumuz profileImageUpload middlewaremızı dahil ettik 
export default auth;