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

//profil bilgilerini güncelliyoruz
const editDetails = asyncErrorWrapper(async (req,res,next) => {

    const id = req.user.id
    //passwordu ayrı olaark aldık ve güncelledik bunu hashleme işlemini daha sağlıklı yapabilmek için yaptık
    const {password,...editInformation} = req.body;
    const user = await User.findByIdAndUpdate(id,editInformation,{
        new:true,
        runValidators:true
    });
    //şifre varsa güncelliyoruz ve save yapıp passwordun hashlenmesini sağlıyoruz
    if(password){
        user.password = password;
        await user.save();
    }

    res.status(200).json({
        success:true,
        data:user
    })

})

const UserController = {getSingleUser, getAllUsers, editDetails};
export default UserController; 