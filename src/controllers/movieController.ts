import { RequestHandler } from 'express';
import 'reflect-metadata';
import { User } from '../entity/User';
import { getRepository } from 'typeorm';
import Movie from '../entity/Movie';
import resetGlobals from '../middlewares/resetGlobalsMiddleware';
import MovieLike from '../entity/MovieLike';

// ADD A MOVIE
export const addMovie: RequestHandler = async (req, res) => {
  try {
    // Get movie info
    const { title, description, isShared } = req.body;

    // Validate user info
    if (!(title && description)) {
      res.status(400).send('All input is required');
    }

    console.log(res.locals.id);
    const user = await getRepository(User).findOne({ id: res.locals.id });

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
    id: res.locals.id,
  });

  const likesByUser = await getRepository(MovieLike).find({ user: user });
  const moviesLikedByUser = [];

  if (likesByUser[0]) {
    likesByUser.map((item) => {
      moviesLikedByUser.push(item.movie.id);
    });
  }

  console.log(moviesLikedByUser);

  const allSharedMovies = await getRepository(Movie).find({
    where: { isShared: true },
    order: { createdAt: 'DESC' },
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
      id: res.locals.id,
    });

    const movie = await getRepository(Movie).findOne({
      id: req.body.id,
    });

    if (movie.isShared) {
      const like = getRepository(MovieLike).create({
        user,
        movie,
      });
      await getRepository(MovieLike).save(like);

      movie.likeCount++;
      await getRepository(Movie).save(movie);

      console.log('you liked this movie');
      res.status(200).redirect('/movies');
    } else {
      res.status(400).send('You cannot like a private movie.');
    }
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
      id: res.locals.id,
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

// TOGGLE MOVIE VISIBILITY
export const toggleMovieVisibility: RequestHandler = async (req, res) => {
  try {
    const id = req.params.id;
    const movie = await getRepository(Movie).findOne(id);

    if (movie.isShared) {
      movie.isShared = false;
    } else {
      movie.isShared = true;
    }

    await getRepository(Movie).save(movie);

    global.successMessage = 'Movie visibility been updated successfully';
    res.status(200).redirect('/users/dashboard');
  } catch (error) {
    global.errorMessage = error;
    res.status(400).redirect('/users/dashboard');
  }
};
