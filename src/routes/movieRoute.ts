const router = require('express').Router();
import * as movieController from '../controllers/movieController';
const auth = require('../middlewares/authMiddleware').default;

// user routes
router.route('/addMovie').post(movieController.addMovie);

export default router;
