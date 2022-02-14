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
import { nanoid } from 'nanoid';

const app = express();
const fileUpload = require('express-fileupload');
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

    let url = undefined;
    // if user has uploaded an image
    if (req.files) {
      // get name and data of uploaded image file
      let imageName = req.files.image['name'];
      const imageData = req.files.image['data'];

      // use nanoid to generate a unique filename for the image
      if (imageName.includes('.')) {
        let fileExtension = imageName.split('.').slice(-1);
        imageName = nanoid(11) + '.' + fileExtension;
      }

      // set upload directory
      const uploadDir = 'public/uploads';

      // if upload directory doesn't exist, create the directory
      if (!fs.existsSync('./' + uploadDir)) {
        fs.mkdirSync('./' + uploadDir);
      }

      // write uploaded image file to the specified directory
      fs.writeFileSync(uploadDir + '/' + imageName, imageData);
      url = '/uploads/' + imageName;
    }
    // Create a new movie
    const movie = getRepository(Movie).create({
      url,
      title,
      description,
      isShared,
      user,
      sharedAt: new Date(),
    });

    // Save the new movie to database
    await getRepository(Movie).save(movie);

    // Redirect user to dashboard page
    global.successMessage = 'Movie has been added successfully';
    return res.status(201).redirect('/users/dashboard');
  } catch (err) {
    global.errorMessage = err.sqlMessage;
    return res.status(400).redirect('/users/dashboard');
  }
};

//________________________________________________________
//                                                        |
//                   UPDATE A MOVIE                       |
//________________________________________________________|
export const updateMovie: RequestHandler = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const movie = await getRepository(Movie).findOne({
      id,
    });

    if (movie.user.id == global.userIN) {
      // Find out which user is adding the movie
      const user = await getRepository(User).findOne({ id: global.userIN });

      // Get movie info
      const { title, description, isShared } = req.body;

      // Validate movie info
      if (!(title && description)) {
        global.errorMessage = 'Title and description are both required!';
        return res.status(400).redirect('/users/dashboard');
      }

      movie.title = title;
      movie.description = description;

      if (isShared) {
        movie.sharedAt = new Date();
      }

      if (isShared != undefined) {
        movie.isShared = isShared;
      }

      // if user has uploaded an image
      if (req.files) {
        // get name and data of uploaded image file
        let imageName = req.files.image['name'];
        const imageData = req.files.image['data'];

        // use nanoid to generate a unique filename for the image
        if (imageName.includes('.')) {
          let fileExtension = imageName.split('.').slice(-1);
          imageName = nanoid(11) + '.' + fileExtension;
        }

        // set upload directory
        const uploadDir = 'public/uploads';

        // if upload directory doesn't exist, create the directory
        if (!fs.existsSync('./' + uploadDir)) {
          fs.mkdirSync('./' + uploadDir);
        }

        // write uploaded image file to the specified directory
        fs.writeFileSync(uploadDir + '/' + imageName, imageData);
        const url = '/uploads/' + imageName;

        movie.url = url;
      }

      // Save the new movie to database
      await getRepository(Movie).save(movie);

      // Redirect user to dashboard page
      global.successMessage = 'Movie has been updated successfully';
      return res.status(201).redirect('/users/dashboard');
    } else {
      global.errorMessage = 'Only movie owner can update the movie!';
      return res.status(403).redirect('/users/dashboard');
    }
  } catch (err) {
    global.errorMessage = err.sqlMessage;
    return res.status(400).redirect('/users/dashboard');
  }
};

//________________________________________________________
//                                                        |
//               LIST ALL SHARED MOVIES                   |
//________________________________________________________|
export const listAllSharedMovies: RequestHandler = async (req, res) => {
  try {
    const currentPage = Number(req.query.page) || 1;
    const moviesPerPage = 8;
    const totalNumberOfMovies = await getRepository(Movie).count({
      isShared: true,
    });

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

    const allSharedMovies = await getRepository(Movie).find({
      where: { isShared: true },
      order: { createdAt: 'DESC' },
      skip: (currentPage - 1) * moviesPerPage,
      take: moviesPerPage,
    });

    return res.render('movies', {
      allSharedMovies,
      moviesLikedByUser,
      page_name: 'movies',
      moviesPerPage,
      totalNumberOfPages: Math.ceil(totalNumberOfMovies / moviesPerPage),
      currentPage,
    });
  } catch (err) {
    global.errorMessage = err.sqlMessage;
    res.status(400).redirect('/users/dashboard');
  }
  res.on('finish', resetGlobals);
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
    // Check if user is the owner of the movie
    if (movie.user.id == global.userIN) {
      // remove movie image if exists. But don't delete the default image.
      if (
        fs.existsSync('./public/' + movie.url) &&
        movie.url != '/images/cinema.jpg'
      ) {
        fs.unlinkSync('public/' + movie.url);
      }
      await getRepository(Movie).delete(id);
      global.successMessage = 'Movie has been deleted successfully';
      return res.status(200).redirect('/users/dashboard');
    } else {
      global.errorMessage = 'Only the movie owner can delete the movie.';
      return res.status(400).redirect('/users/dashboard');
    }
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
      movie.sharedAt = new Date();
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
      user,
    });
  } catch (error) {
    global.errorMessage = error;
    res.status(400).redirect('/movies');
  }
  res.on('finish', resetGlobals);
};
