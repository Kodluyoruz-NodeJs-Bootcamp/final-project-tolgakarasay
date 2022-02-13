import { RequestHandler } from 'express';
import 'reflect-metadata';
import { User } from '../entity/User';
import { getRepository } from 'typeorm';
import Actor from '../entity/Actor';
import ActorLike from '../entity/ActorLike';

//________________________________________________________
//                                                        |
//                    LIKE AN ACTOR                       |
//________________________________________________________|
export const likeActor: RequestHandler = async (req, res) => {
  try {
    const user = await getRepository(User).findOne({
      id: global.userIN,
    });

    const actor = await getRepository(Actor).findOne({
      id: req.body.id,
    });

    if (actor.isShared || actor.user.id == global.userIN) {
      const like = getRepository(ActorLike).create({
        user,
        actor,
      });
      await getRepository(ActorLike).save(like);

      actor.likeCount++;
      await getRepository(Actor).save(actor);

      console.log('you liked this actor');
      return res.status(200).redirect(req.body.requestAddress);
    } else {
      return res
        .status(401)
        .send('Only the actor owner can like a private actor.');
    }
  } catch (error) {
    return res.status(400).json({
      status: 'fail',
      error,
    });
  }
};

//________________________________________________________
//                                                        |
//                   UNLIKE AN ACTOR                      |
//________________________________________________________|
export const unlikeActor: RequestHandler = async (req, res) => {
  try {
    const user = await getRepository(User).findOne({
      id: global.userIN,
    });

    const actor = await getRepository(Actor).findOne({
      id: req.body.id,
    });

    const like = await getRepository(ActorLike).findOne({
      user,
      actor,
    });

    await getRepository(ActorLike).delete(like.id);

    actor.likeCount--;
    await getRepository(Actor).save(actor);

    console.log('you unliked this actor');
    console.log(req.body.requestAddress);
    return res.status(200).redirect(req.body.requestAddress);
  } catch (error) {
    return res.status(400).json({
      status: 'fail',
      error,
    });
  }
};
