import CustomError from "../../helpers/error/CustomError.js";
import asyncErrorWrapper from "../../helpers/error/asyncErrorWrapper.js";
import User from "../../models/User.js";

//sorgu işlemlerinde sürekli id kontrolü yapmamak için merkezi bir id kontrol middleware ı oluşturduk
const checkExistUser = asyncErrorWrapper(async (req,res,next) => {
    const {id} = req.params;

    const user = await User.findById(id);

    if(!user){
        next(new CustomError("There is no such user with that id",400))
    }
    //istersek bu şekilde bir daha sorhu yapmamak adına req üzerine herhangi bir isimle datalarımızı kayıt edebiliriz biz burada data olarak kayıt ettik
    req.data = user;
    next(); //sorun yoksa devam ettirdik
 })

 export {checkExistUser};