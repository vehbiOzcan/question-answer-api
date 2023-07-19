import express from 'express'
import AdminController from '../controllers/admin.js';
import { getAccessToRoute, getAdminAccess } from '../middlewares/auth/auth.js';

const admin = express.Router();
admin.use([getAccessToRoute,getAdminAccess])
admin.get("/",AdminController.getAdmin);

export default admin;