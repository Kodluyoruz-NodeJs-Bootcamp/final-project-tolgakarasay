import { RequestHandler } from 'express';
import 'reflect-metadata';
import { User } from '../entity/User';
import { getRepository } from 'typeorm';
import Movie from '../entity/Movie';
import resetGlobals from '../middlewares/resetGlobalsMiddleware';
import MovieLike from '../entity/MovieLike';

// This function is invoked to add a new movie
export const addMovie: RequestHandler = async (req, res) => {
  try {
    // Get movie info
    const { title, description, isShared } = req.body;

    // Validate user info
    if (!(title && description)) {
      res.status(400).send('All input is required');
    }

    const currentUserId = req.session.userID;

    const user = await getRepository(User).findOne(currentUserId);

    // Create new movie
    const movie = getRepository(Movie).create({
      title,
      description,
      isShared,
      user,
    });

    // Save new user to database
    await getRepository(Movie).save(movie);

    // Redirect user to dashboard page
    global.successMessage = 'Movie has been added successfully';
    res.status(201).redirect('/users/dashboard');
  } catch (err) {
    console.log(err);
    global.errorMessage = err.sqlMessage;
    res.status(400).redirect('/users/dashboard');
  }
};

// LIST ALL SHARED MOVIES
export const listAllSharedMovies: RequestHandler = async (req, res) => {
  const user = await getRepository(User).findOne({
    id: req.session.userID,
  });
  const likesByUser = await getRepository(MovieLike).find({ user: user });
  const moviesLikedByUser = [];
  likesByUser.map((item) => {
    moviesLikedByUser.push(item.movie.id);
  });

  console.log(moviesLikedByUser);
  const allSharedMovies = await getRepository(Movie).find({
    isShared: true,
  });
  res.render('movies', { allSharedMovies, moviesLikedByUser });
};

// DELETE A MOVIE
export const deleteMovie: RequestHandler = async (req, res) => {
  const id = req.params.id;
  try {
    await getRepository(Movie).delete(id);
    global.successMessage = 'Movie has been deleted successfully';
    res.status(200).redirect('/users/dashboard');
  } catch (error) {
    global.errorMessage = error;
    res.status(400).redirect('/users/dashboard');
  }
};

// LIKE A MOVIE
export const likeMovie: RequestHandler = async (req, res) => {
  try {
    const user = await getRepository(User).findOne({
      id: req.session.userID,
    });

    const movie = await getRepository(Movie).findOne({
      id: req.body.id,
    });

    const like = getRepository(MovieLike).create({
      user,
      movie,
    });
    await getRepository(MovieLike).save(like);

    movie.likeCount++;
    await getRepository(Movie).save(movie);

    console.log('you liked this movie');
    res.status(200).redirect('/movies');
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};

// UNLIKE A MOVIE
export const unlikeMovie: RequestHandler = async (req, res) => {
  try {
    const user = await getRepository(User).findOne({
      id: req.session.userID,
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

    console.log('you unliked this movie');
    res.status(200).redirect('/movies');
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};
