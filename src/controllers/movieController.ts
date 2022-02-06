import { RequestHandler } from 'express';
import 'reflect-metadata';
import { User } from '../entity/User';
import { getRepository } from 'typeorm';
import Movie from '../entity/Movie';

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

    // Redirect user to login page
    return res.status(201).render('login', {
      errorMessage: null,
      successMessage: 'Movie has been added successfully',
      page_name: 'login',
    });
  } catch (err) {
    console.log(err);
  }
};
