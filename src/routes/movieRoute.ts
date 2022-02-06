const router = require('express').Router();
import * as movieController from '../controllers/movieController';
const auth = require('../middlewares/authMiddleware').default;

// movie routes
router.route('/addMovie').post(auth, movieController.addMovie);
router.route('/').get(auth, movieController.listAllSharedMovies);
router.route('/:id').delete(movieController.deleteMovie);
router.route('/like').post(movieController.likeMovie);
router.route('/unlike').post(movieController.unlikeMovie);
export default router;
