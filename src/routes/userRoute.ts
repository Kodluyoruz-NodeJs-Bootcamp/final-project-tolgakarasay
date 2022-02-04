const router = require('express').Router();
import * as userController from '../controllers/userController';
const auth = require('../middlewares/authMiddleware').default;

// user routes
router.route('/signup').post(userController.registerUser);
router.route('/login').post(userController.makeUserLogin);
//router.route('/list').get(auth, userController.listUsers);
router.route('/logout').get(userController.makeUserLogout);

export default router;
