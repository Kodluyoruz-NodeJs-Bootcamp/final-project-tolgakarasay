import { RequestHandler } from 'express';
import 'reflect-metadata';
import { User } from '../entity/User';
import { getRepository } from 'typeorm';
import Movie from '../entity/Movie';
import resetGlobals from '../middlewares/resetGlobalsMiddleware';
import MovieLike from '../entity/MovieLike';
import MovieReview from '../entity/MovieReview';
import Actor from '../entity/Actor';
import ActorLike from '../entity/ActorLike';
import ActorReview from '../entity/ActorReview';

//________________________________________________________
//                                                        |
//           LIST ALL SHARED MOVIES AND ACTORS            |
//________________________________________________________|
export const listAllSharedMovies: RequestHandler = async (req, res) => {
  try {
    const itemsPerPage = 10;

    const user = await getRepository(User).findOne({
      id: global.userIN,
    });

    const allMovieLikesByUser = await getRepository(MovieLike).find({
      user: user,
    });
    const moviesLikedByUser = [];

    if (allMovieLikesByUser[0]) {
      allMovieLikesByUser.map((item) => {
        moviesLikedByUser.push(item.movie.id);
      });
    }

    const allActorLikesByUser = await getRepository(ActorLike).find({
      user: user,
    });
    const actorsLikedByUser = [];

    if (allActorLikesByUser[0]) {
      allActorLikesByUser.map((item) => {
        actorsLikedByUser.push(item.actor.id);
      });
    }

    const allSharedMovies = await getRepository(Movie).find({
      where: { isShared: true },
      order: { updatedAt: 'DESC' },
      take: itemsPerPage,
    });

    const allSharedActors = await getRepository(Actor).find({
      where: { isShared: true },
      order: { updatedAt: 'DESC' },
      take: itemsPerPage,
    });

    const allMovieReviews = await getRepository(MovieReview).find();
    const allActorReviews = await getRepository(ActorReview).find();

    return res.render('newsfeed', {
      allSharedMovies,
      allSharedActors,
      moviesLikedByUser,
      actorsLikedByUser,
      page_name: 'newsfeed',
      itemsPerPage,
      user,
      allActorReviews,
      allMovieReviews,
    });
  } catch (err) {
    console.log(err);
    global.errorMessage = err.sqlMessage;
    res.status(400).redirect('/users/dashboard');
  }
  res.on('finish', resetGlobals);
};
