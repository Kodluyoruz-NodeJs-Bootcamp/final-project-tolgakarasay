import { RequestHandler } from 'express';
import 'reflect-metadata';
import { User } from '../entity/User';
import { getRepository } from 'typeorm';
import Movie from '../entity/Movie';
import resetGlobals from '../middlewares/resetGlobalsMiddleware';
import MovieLike from '../entity/MovieLike';
import MovieReview from '../entity/MovieReview';

//________________________________________________________
//                                                        |
//                   ADD MOVIE REVIEW                     |
//________________________________________________________|
export const addMovieReview: RequestHandler = async (req, res) => {
  try {
    const user = await getRepository(User).findOne({
      id: global.userIN,
    });

    const movie = await getRepository(Movie).findOne({
      id: req.body.id,
    });

    const text = req.body.text;

    const requestAddress = req.body.requestAddress;

    if (movie.isShared || movie.user.id == global.userIN) {
      const review = getRepository(MovieReview).create({
        user,
        movie,
        text,
      });
      await getRepository(MovieReview).save(review);

      movie.reviewCount++;
      await getRepository(Movie).save(movie);

      console.log('you added a review to this movie');
      return res.status(200).redirect(requestAddress);
    } else {
      return res
        .status(400)
        .send('Only movie owner can add reviews to private movie.');
    }
  } catch (error) {
    return res.status(400).json({
      status: 'fail',
      error,
    });
  }
};
