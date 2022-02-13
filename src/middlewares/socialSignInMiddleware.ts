import { NextFunction, Request, RequestHandler, Response } from 'express';
import { customAlphabet } from 'nanoid';
import { getRepository } from 'typeorm';
import User, { AuthMethod } from '../entity/User';

const socialLoginOrRegister: RequestHandler = async (req, res, next) => {
  try {
    const email = res.locals.email;
    const authMethod = res.locals.authMethod;
    // Check if user already exists in the database
    const userWithSameEmail = await getRepository(User).findOne({ email });

    if (userWithSameEmail) {
      if (userWithSameEmail.authMethod === authMethod) {
        global.userIN = userWithSameEmail.id;

        return next();
      }

      global.errorMessage =
        'This email address is associated with another authentication method!';

      return res.status(400).redirect('/login');
    }

    // Assign a random profile photo
    const number = 10 + Math.floor(23 * Math.random());
    const avatarUrl = `/images/profile/${number}.png`;

    // Assign a username
    const nanoid = customAlphabet('1234567890', 2);
    const username = email.split('@')[0] + '_' + nanoid();

    const user = getRepository(User).create({
      email,
      username,
      password: null,
      avatarUrl,
      authMethod,
    });

    // Save new user to database
    await getRepository(User).save(user);
    global.userIN = user.id;

    return next();
  } catch (error) {
    global.errorMessage = error;
    return res.status(400).redirect('/login');
  }
};

export default socialLoginOrRegister;
