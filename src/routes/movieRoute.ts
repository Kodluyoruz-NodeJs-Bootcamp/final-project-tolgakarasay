const router = require('express').Router();
import * as movieController from '../controllers/movieController';
const auth = require('../middlewares/authMiddleware').default;

// movie routes
router.route('/addMovie').post(auth, movieController.addMovie);
router.route('/').get(auth, movieController.listAllSharedMovies);
router.route('/:id').delete(auth, movieController.deleteMovie);
router.route('/like').post(auth, movieController.likeMovie);
router.route('/unlike').post(auth, movieController.unlikeMovie);
router.route('/:id').put(auth, movieController.toggleMovieVisibility);
router.route('/:id').get(auth, movieController.getMovie);
export default router;
