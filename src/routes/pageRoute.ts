const router = require('express').Router();
import * as pageController from '../controllers/pageController';

// page routes
router.route('/').get(pageController.getIndexPage);

export default router;
