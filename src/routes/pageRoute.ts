const router = require('express').Router();
import * as pageController from '../controllers/pageController';

// page routes
router.route('/').get(pageController.getIndexPage);
router.route('/login').get(pageController.getLoginPage);
router.route('/signup').get(pageController.getSignupPage);

export default router;
