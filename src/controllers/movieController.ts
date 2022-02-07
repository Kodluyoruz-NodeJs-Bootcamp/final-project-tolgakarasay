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
      global.errorMessage = 'All input is required';
      return res.status(400).redirect('/users/dashboard');
    }

    console.log(global.userIN);
    const user = await getRepository(User).findOne({ id: global.userIN });

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
    return res.status(201).redirect('/users/dashboard');
  } catch (err) {
    console.log(err);
    global.errorMessage = err.sqlMessage;
    return res.status(400).redirect('/users/dashboard');
  }
};

// LIST ALL SHARED MOVIES
export const listAllSharedMovies: RequestHandler = async (req, res) => {
  const user = await getRepository(User).findOne({
    id: global.userIN,
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

  return res.render('movies', { allSharedMovies, moviesLikedByUser });
};

// DELETE A MOVIE
export const deleteMovie: RequestHandler = async (req, res) => {
  const id = req.params.id;
  try {
    await getRepository(Movie).delete(id);
    global.successMessage = 'Movie has been deleted successfully';
    return res.status(200).redirect('/users/dashboard');
  } catch (error) {
    global.errorMessage = error;
    return res.status(400).redirect('/users/dashboard');
  }
};

// LIKE A MOVIE
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

      console.log('you liked this movie');
      return res.status(200).redirect(req.body.requestAddress);
    } else {
      return res
        .status(400)
        .send('Only the movie owner can like a private movie.');
    }
  } catch (error) {
    return res.status(400).json({
      status: 'fail',
      error,
    });
  }
};

// UNLIKE A MOVIE
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

    console.log('you unliked this movie');
    console.log(req.body.requestAddress);
    return res.status(200).redirect(req.body.requestAddress);
  } catch (error) {
    return res.status(400).json({
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
    return res.status(200).redirect('/users/dashboard');
  } catch (error) {
    global.errorMessage = error;
    return res.status(400).redirect('/users/dashboard');
  }
};

// GET SINGLE MOVIE PAGE
export const getMovie: RequestHandler = async (req, res) => {
  try {
    const movie = await getRepository(Movie).findOne(req.params.id);

    const user = await getRepository(User).findOne({
      id: global.userIN,
    });

    const likesByUser = await getRepository(MovieLike).find({ user: user });
    const moviesLikedByUser = [];

    if (likesByUser[0]) {
      likesByUser.map((item) => {
        moviesLikedByUser.push(item.movie.id);
      });
    }

    console.log(global.userIN);
    console.log(movie.user.id);
    if (movie.isShared == false && movie.user.id != global.userIN) {
      return res
        .status(403)
        .send(
          "Access Denied. A private movie's page can only be seen by its creator."
        );
    }
    res.status(200).render('movie', {
      page_name: 'movie',
      movie,
      moviesLikedByUser,
    });
  } catch (error) {
    global.errorMessage = error;
    res.status(400).redirect('/movies');
  }
  res.on('finish', resetGlobals);
};
