import asyncErrorWrapper from "../helpers/error/asyncErrorWrapper.js";
import CustomError from "../helpers/error/CustomError.js";
import User from "../models/User.js";


const getAdmin = asyncErrorWrapper(async (req,res,next) => {
    // const {id} = req.user;
    // const user = await User.findById(id);

    res.status(200).json({
        success:true,
        data:"Login Admin Page"
    })
})

const AdminController = {getAdmin,};
export default AdminController;