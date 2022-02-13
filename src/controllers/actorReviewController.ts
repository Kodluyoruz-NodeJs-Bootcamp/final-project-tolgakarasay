import { RequestHandler } from 'express';
import 'reflect-metadata';
import { User } from '../entity/User';
import { getRepository } from 'typeorm';
import Actor from '../entity/Actor';
import resetGlobals from '../middlewares/resetGlobalsMiddleware';
import ActorLike from '../entity/ActorLike';
import ActorReview from '../entity/ActorReview';

//________________________________________________________
//                                                        |
//                   ADD ACTOR REVIEW                     |
//________________________________________________________|
export const addActorReview: RequestHandler = async (req, res) => {
  try {
    const user = await getRepository(User).findOne({
      id: global.userIN,
    });

    const actor = await getRepository(Actor).findOne({
      id: req.body.id,
    });

    const text = req.body.text;
    const requestAddress = req.body.requestAddress;

    if (actor.isShared || actor.user.id == global.userIN) {
      const review = getRepository(ActorReview).create({
        user,
        actor,
        text,
      });
      await getRepository(ActorReview).save(review);

      actor.reviewCount++;
      await getRepository(Actor).save(actor);

      global.successMessage = 'Actor comment has been added successfully';
      return res.status(200).redirect(requestAddress);
    } else {
      return res
        .status(400)
        .send('Only actor owner can add reviews to private actor.');
    }
  } catch (error) {
    return res.status(400).json({
      status: 'fail',
      error,
    });
  }
};
