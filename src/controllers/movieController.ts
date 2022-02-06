import { RequestHandler } from 'express';
import 'reflect-metadata';
import { User } from '../entity/User';
import { getRepository } from 'typeorm';
import Movie from '../entity/Movie';
import resetGlobals from '../middlewares/resetGlobalsMiddleware';

// This function is invoked to add a new movie
export const addMovie: RequestHandler = async (req, res) => {
  try {
    // Get movie info
    const { title, description } = req.body;

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
    res.status(201).redirect('/users/dashboard');
  }
};

// this function is invoked to list all users in the database
export const listAllMovies: RequestHandler = async (req, res) => {
  const allMovies = await getRepository(Movie).find();
  res.render('movies', { allMovies });
};
