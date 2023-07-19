import mongoose from "mongoose";
import asyncErrorWrapper from "../helpers/error/asyncErrorWrapper.js";
import CustomError from "../helpers/error/CustomError.js";
import User from "../models/User.js";
import { objectIdCasting } from "../middlewares/database/objectIdCasting.js";



const getAdmin = asyncErrorWrapper(async (req,res,next) => {
    // const {id} = req.user;
    // const user = await User.findById(id);

    res.status(200).json({
        success:true,
        data:"Login Admin Page"
    })
})

const blockUser = asyncErrorWrapper(async (req,res,next) => {
    const id = req.params;
    const castId = objectIdCasting(id) 
    const user = await User.findById(castId);

    user.blocked = !user.blocked;
    
    await user.save();

    res.status(200).json({
        success:true,
        block_state:user.blocked,
        message: user.blocked ? `${user._id} User is Blocked` : `${user._id} User is Unblocked`
    })
})

const deleteUser = asyncErrorWrapper(async (req,res,next) => {
    const id = objectIdCasting(req.params);
    const user = await User.findByIdAndRemove(id);

    res.status(200).json({
        success:true,
        message:"Delete User Successfull"
    })
})

const AdminController = {getAdmin,blockUser,deleteUser};
export default AdminController;