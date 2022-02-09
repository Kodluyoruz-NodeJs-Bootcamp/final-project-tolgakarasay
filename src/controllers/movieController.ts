import { RequestHandler } from 'express';
import 'reflect-metadata';
import { User } from '../entity/User';
import { getRepository } from 'typeorm';
import Movie from '../entity/Movie';
import resetGlobals from '../middlewares/resetGlobalsMiddleware';
import MovieLike from '../entity/MovieLike';
import MovieReview from '../entity/MovieReview';
import * as fs from 'fs';

import * as express from 'express';
const app = express();
const fileUpload = require('express-fileupload'); // modülü kullanıma alıyoruz.
app.use(fileUpload());

//________________________________________________________
//                                                        |
//                     ADD A MOVIE                        |
//________________________________________________________|
export const addMovie: RequestHandler = async (req, res) => {
  try {
    // Find out which user is adding the movie
    const user = await getRepository(User).findOne({ id: global.userIN });

    // Get movie info
    const { title, description, isShared } = req.body;

    // Validate movie info
    if (!(title && description)) {
      global.errorMessage = 'All input is required';
      return res.status(400).redirect('/users/dashboard');
    }

    // get name and data of uploaded image file
    const imageName = req.files.image['name'];
    const imageData = req.files.image['data'];

    // set upload directory
    const uploadDir = 'public/uploads';

    // if upload directory doesn't exist, create the directory
    if (!fs.existsSync('./' + uploadDir)) {
      fs.mkdirSync('./' + uploadDir);
    }

    // write uploaded image file to the specified directory
    fs.writeFileSync(uploadDir + '/' + imageName, imageData);
    const url = '/uploads/' + imageName;

    // Create a new movie
    const movie = getRepository(Movie).create({
      url,
      title,
      description,
      isShared,
      user,
    });

    // Save the new movie to database
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

//________________________________________________________
//                                                        |
//               LIST ALL SHARED MOVIES                   |
//________________________________________________________|
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

//________________________________________________________
//                                                        |
//                    DELETE A MOVIE                      |
//________________________________________________________|
export const deleteMovie: RequestHandler = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const movie = await getRepository(Movie).findOne({
      id,
    });

    // remove movie image
    fs.unlinkSync('public/' + movie.url);

    await getRepository(Movie).delete(id);
    global.successMessage = 'Movie has been deleted successfully';
    return res.status(200).redirect('/users/dashboard');
  } catch (error) {
    global.errorMessage = error;
    return res.status(400).redirect('/users/dashboard');
  }
};

//________________________________________________________
//                                                        |
//                 TOGGLE MOVIE VISIBILITY                |
//________________________________________________________|
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

//________________________________________________________
//                                                        |
//                 GET SINGLE MOVIE PAGE                  |
//________________________________________________________|
export const getMovie: RequestHandler = async (req, res) => {
  try {
    const movie = await getRepository(Movie).findOne(req.params.id);

    const user = await getRepository(User).findOne({
      id: global.userIN,
    });

    const movieReviews = await getRepository(MovieReview).find({
      movie,
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
      movieReviews,
      moviesLikedByUser,
    });
  } catch (error) {
    global.errorMessage = error;
    console.log(error);
    res.status(400).redirect('/movies');
  }
  res.on('finish', resetGlobals);
};
