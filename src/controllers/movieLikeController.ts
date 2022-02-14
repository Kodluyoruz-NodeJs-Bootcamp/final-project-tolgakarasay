import { RequestHandler } from 'express';
import 'reflect-metadata';
import { User } from '../entity/User';
import { getRepository } from 'typeorm';
import Movie from '../entity/Movie';
import MovieLike from '../entity/MovieLike';

//________________________________________________________
//                                                        |
//                    LIKE A MOVIE                        |
//________________________________________________________|
export const likeMovie: RequestHandler = async (req, res) => {
  try {
    const user = await getRepository(User).findOne({
      id: global.userIN,
    });

    const movie = await getRepository(Movie).findOne({
      id: req.body.id,
    });

    if (movie.isShared || movie.user.id == global.userIN) {
      const like = getRepository(MovieLike).create({
        user,
        movie,
      });
      await getRepository(MovieLike).save(like);

      movie.likeCount++;
      await getRepository(Movie).save(movie);

      return res.status(200).redirect(req.body.requestAddress);
    } else {
      return res
        .status(403)
        .send('Only the movie owner can like a private movie.');
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
//                   UNLIKE A MOVIE                       |
//________________________________________________________|
export const unlikeMovie: RequestHandler = async (req, res) => {
  try {
    const user = await getRepository(User).findOne({
      id: global.userIN,
    });

    const movie = await getRepository(Movie).findOne({
      id: req.body.id,
    });

    const like = await getRepository(MovieLike).findOne({
      user,
      movie,
    });

    await getRepository(MovieLike).delete(like.id);

    movie.likeCount--;
    await getRepository(Movie).save(movie);

    return res.status(200).redirect(req.body.requestAddress);
  } catch (error) {
    return res.status(400).json({
      status: 'fail',
      error,
    });
  }
};
