const router = require('express').Router();
import * as movieController from '../controllers/movieController';
import * as movieLikeController from '../controllers/movieLikeController';
import * as movieReviewController from '../controllers/movieReviewController';
import * as newsfeedController from '../controllers/newsfeedController';
const auth = require('../middlewares/authMiddleware').default;

// movie routes

router.route('/').get(auth, newsfeedController.listAllSharedMovies);
// router.route('/like').post(auth, movieLikeController.likeMovie);
// router.route('/unlike').post(auth, movieLikeController.unlikeMovie);
// router.route('/addReview').post(auth, movieReviewController.addMovieReview);
export default router;
