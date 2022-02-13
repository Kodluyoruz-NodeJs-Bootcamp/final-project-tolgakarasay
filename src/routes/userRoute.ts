const router = require('express').Router();
import * as userController from '../controllers/userController';
import signJwt from '../middlewares/signJwtMiddleware';
import socialLoginOrRegister from '../middlewares/socialSignInMiddleware';
const auth = require('../middlewares/authMiddleware').default;

// user routes
router.route('/signup').post(userController.registerUser);
router.route('/login').post(userController.makeUserLogin, signJwt);
//router.route('/list').get(auth, userController.listUsers);
router.route('/logout').get(userController.makeUserLogout);
router.route('/dashboard').get(auth, userController.getDashboardPage);
router
  .route('/googleauth')
  .post(userController.googleSignIn, socialLoginOrRegister, signJwt);
router
  .route('/facebookauth')
  .get(userController.facebookSignIn, socialLoginOrRegister, signJwt);
export default router;
