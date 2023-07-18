import asyncErrorWrapper from "../helpers/error/asyncErrorWrapper.js";
import CustomError from "../helpers/error/CustomError.js";
import User from "../models/User.js";

//Id ye göre kullanıcı bilgilerini alma 
const getSingleUser = asyncErrorWrapper(async (req,res,next) => {
    //parametre olarak id bilgisini aldık 
    const {id} = req.params
    //id ye göre User içerisinde ardık
    const user = await User.findById(id);

    if(!user){
        next(new CustomError("There is no such user with that id", 404));
    }

    res.status(200).json({
        success:true,
        data:user
    })
})


const UserController = {getSingleUser};
export default UserController; 