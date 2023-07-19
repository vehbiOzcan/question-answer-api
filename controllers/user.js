import asyncErrorWrapper from "../helpers/error/asyncErrorWrapper.js";
import CustomError from "../helpers/error/CustomError.js";
import User from "../models/User.js";

//Id ye göre kullanıcı bilgilerini alma 
const getSingleUser = asyncErrorWrapper(async (req,res,next) => {
    //parametre olarak id bilgisini aldık 
    const {id} = req.params
    //id ye göre User içerisinde ardık
    const user = await User.findById(id);

    // if(!user){
    //     next(new CustomError("There is no such user with that id", 404));
    // } //bu kısmı checkExistUser middlewareni uyguladığımız için iptal ettik 
    //eğer istersek hiç sorgu yapmadan direk req.data diyerek midd. kayıt ettiğimiz veriyi de alabilirdik

    res.status(200).json({
        success:true,
        data:user
    })
})

//Tüm userları alma işlemi
const getAllUsers = asyncErrorWrapper(async (req,res,next) => {
    const user = await User.find().select("-email -_id") // bu şekilde istediğimiz özellikleri almaz istediklerimizi alabiliriz almak istediklerime + istemdiklerimize - koyarız

    res.status(200).json({
        success:true,
        data:user
    })
})


const UserController = {getSingleUser, getAllUsers};
export default UserController; 