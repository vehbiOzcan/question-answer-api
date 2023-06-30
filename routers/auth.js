import express  from "express";
//Controllers
import AuthController from "../controllers/auth.js";
import { getAccessToRoute } from "../middlewares/auth/auth.js";

const auth = express.Router();

auth.post("/register",AuthController.register)
auth.get("/error",AuthController.errorTest)

//Token kontrolü yapan route deneme fonksiyonu
auth.get("/tokentest",getAccessToRoute,AuthController.tokenTest) //Token lazım olan routelara uyguluyoruz

auth.get("/profile",getAccessToRoute,AuthController.getUser) //Tokenımız ile userımızı getiriyoruyz
auth.post("/login",AuthController.login) 

export default auth;