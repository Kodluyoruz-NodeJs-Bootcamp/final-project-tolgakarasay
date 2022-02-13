const router = require('express').Router();
import * as newsfeedController from '../controllers/newsfeedController';
const auth = require('../middlewares/authMiddleware').default;

// NEWSFEED ROUTE
router.route('/').get(auth, newsfeedController.listAllSharedMoviesAndActors);
export default router;
