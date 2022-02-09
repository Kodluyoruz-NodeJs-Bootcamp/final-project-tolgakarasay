const router = require('express').Router();
import * as movieController from '../controllers/movieController';
import * as movieLikeController from '../controllers/movieLikeController';
import * as movieReviewController from '../controllers/movieReviewController';
const auth = require('../middlewares/authMiddleware').default;

// movie routes
router.route('/addMovie').post(auth, movieController.addMovie);
router.route('/').get(auth, movieController.listAllSharedMovies);
router.route('/:id').delete(auth, movieController.deleteMovie);
router.route('/like').post(auth, movieLikeController.likeMovie);
router.route('/unlike').post(auth, movieLikeController.unlikeMovie);
router.route('/visibility:id').put(auth, movieController.toggleMovieVisibility);
router.route('/:id').put(auth, movieController.updateMovie);
router.route('/:id').get(auth, movieController.getMovie);
router.route('/addReview').post(auth, movieReviewController.addMovieReview);
export default router;
