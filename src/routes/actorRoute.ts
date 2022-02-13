const router = require('express').Router();
import * as actorController from '../controllers/actorController';
import * as actorLikeController from '../controllers/actorLikeController';
import * as actorReviewController from '../controllers/actorReviewController';
const auth = require('../middlewares/authMiddleware').default;

// ACTOR ROUTES
router.route('/addActor').post(auth, actorController.addActor);
router.route('/').get(auth, actorController.listAllSharedActors);
router.route('/:id').delete(auth, actorController.deleteActor);
router.route('/visibility:id').put(auth, actorController.toggleActorVisibility);
router.route('/:id').put(auth, actorController.updateActor);
router.route('/:id').get(auth, actorController.getActor);
router.route('/like').post(auth, actorLikeController.likeActor);
router.route('/unlike').post(auth, actorLikeController.unlikeActor);
router.route('/addReview').post(auth, actorReviewController.addActorReview);
export default router;
