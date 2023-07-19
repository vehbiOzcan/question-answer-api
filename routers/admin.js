import express from 'express'
import AdminController from '../controllers/admin.js';
import { getAccessToRoute, getAdminAccess } from '../middlewares/auth/auth.js';
import { checkExistUser } from '../middlewares/database/databaseErrorHelpers.js';

const admin = express.Router();
admin.use([getAccessToRoute,getAdminAccess])
admin.get("/",AdminController.getAdmin);
admin.put("/block/:id",checkExistUser,AdminController.blockUser);
admin.delete("/user/:id",checkExistUser,AdminController.deleteUser)
export default admin;