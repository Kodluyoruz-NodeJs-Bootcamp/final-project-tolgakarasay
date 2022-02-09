const router = require('express').Router();
import * as pageController from '../controllers/pageController';
import { isLoggedIn } from '../middlewares/redirectMiddleware';

// page routes
router.route('/').get(isLoggedIn, pageController.getIndexPage);
router.route('/login').get(isLoggedIn, pageController.getLoginPage);
router.route('/signup').get(isLoggedIn, pageController.getSignupPage);

export default router;
