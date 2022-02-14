import * as bcrypt from 'bcryptjs';
import { RequestHandler } from 'express';
import 'reflect-metadata';
import { AuthMethod, User } from '../entity/User';
import { Any, getRepository } from 'typeorm';
import { Movie } from '../entity/Movie';
import resetGlobals from '../middlewares/resetGlobalsMiddleware';
import Actor from '../entity/Actor';
import { OAuth2Client } from 'google-auth-library';
import axios from 'axios';

const CLIENT_ID_GOOGLE = process.env.CLIENT_ID_GOOGLE;
const client = new OAuth2Client(CLIENT_ID_GOOGLE);

//________________________________________________________
//                                                        |
//              REGISTER A NEW USER (LOCAL)               |
//________________________________________________________|
export const registerUser: RequestHandler = async (req, res) => {
  try {
    // Get user credentials
    const { email, username, password } = req.body;

    // Validate user credentials
    if (!(email && username && password)) {
      global.errorMessage = 'All input is required';
      return res.status(400).redirect('/signup');
    }

    // Check if user already exists in the database
    const userWithSameEmail = await getRepository(User).findOne({ email });
    const userWithSameUsername = await getRepository(User).findOne({
      username,
    });

    if (userWithSameEmail || userWithSameUsername) {
      global.errorMessage = 'User already exists!';
      return res.status(409).redirect('/signup');
    }

    // Encrypt user password
    const encryptedPassword = await bcrypt.hash(password, 10);

    // Assign a random profile photo
    const number = 10 + Math.floor(23 * Math.random());
    const avatarUrl = `/images/profile/${number}.png`;
    // Create new user
    const user = getRepository(User).create({
      email,
      username,
      password: encryptedPassword,
      avatarUrl,
      authMethod: AuthMethod.LOCAL,
    });

    // Save new user to database
    await getRepository(User).save(user);

    // Redirect new user to login page
    global.successMessage =
      'You have been succesfully registered. Please login.';
    return res.status(201).redirect('/login');
  } catch (err) {
    global.errorMessage = err;
    return res.status(400).redirect('/signup');
  }
};

//________________________________________________________
//                                                        |
//                MAKE USER LOGIN (LOCAL)                 |
//________________________________________________________|
export const makeUserLogin: RequestHandler = async (req, res, next) => {
  try {
    // Get user input at login page
    const { username, password } = req.body;

    // Validate user input
    if (!(username && password)) {
      return res.status(400).send('All input is required');
    }

    // If user exists and password matches, create token
    const user = await getRepository(User).findOne({ username });
    if (user && (await bcrypt.compare(password, user.password))) {
      global.userIN = user.id;
      return next();
    }
    global.errorMessage = 'Invalid credentials!';
  } catch (err) {
    global.errorMessage = err;
  }
  return res.status(400).redirect('/login');
};

//________________________________________________________
//                                                        |
//                   MAKE USER LOGOUT                     |
//________________________________________________________|
export const makeUserLogout: RequestHandler = (req, res) => {
  res.clearCookie('access_token');
  global.userIN = null;
  return res.status(200).redirect('/login');
};

//________________________________________________________
//                                                        |
//                  GET DASHBOARD PAGE                    |
//________________________________________________________|
export const getDashboardPage: RequestHandler = async (req, res) => {
  const user = await getRepository(User).findOne(global.userIN);

  const userMovies = await getRepository(Movie).find({
    where: { user },
    order: { createdAt: 'DESC' },
  });

  const userActors = await getRepository(Actor).find({
    where: { user },
    order: { createdAt: 'DESC' },
  });

  res.status(200).render('dashboard', {
    user,
    page_name: 'dashboard',
    errorMessage: global.errorMessage,
    succesMessage: global.successMessage,
    userMovies,
    userActors,
  });

  res.on('finish', resetGlobals);
};

//________________________________________________________
//                                                        |
//                     GOOGLE SIGN IN                     |
//________________________________________________________|
export const googleSignIn: RequestHandler = async (req, res, next) => {
  try {
    const idToken = req.body.idtoken;

    // Verify Google's idToken
    const ticket = await client.verifyIdToken({
      idToken,
      audience: CLIENT_ID_GOOGLE,
    });

    const payload = ticket.getPayload();

    const email = payload['email'];

    res.locals.email = email;
    res.locals.authMethod = AuthMethod.GOOGLE;
    return next();

    // return next();
  } catch (error) {
    global.errorMessage = error;
    return res.status(400).redirect('/login');
  }
};

//________________________________________________________
//                                                        |
//                   FACEBOOK SIGN IN                     |
//________________________________________________________|
export const facebookSignIn: RequestHandler = async (req, res, next) => {
  const code = req.query.code;

  async function getAccessTokenFromCode(code) {
    const { data } = await axios({
      url: 'https://graph.facebook.com/v13.0/oauth/access_token',
      method: 'get',
      params: {
        client_id: process.env.CLIENT_ID_FB,
        client_secret: process.env.CLIENT_SECRET_FB,
        redirect_uri: 'http://localhost:3000/users/facebookauth',
        code,
      },
    });

    return data.access_token;
  }

  async function getEmailFromAccessToken(access_token) {
    const { data } = await axios({
      url: 'https://graph.facebook.com/me',
      method: 'get',
      params: {
        access_token: access_token,
        fields: 'email',
      },
    });

    return data.email;
  }

  try {
    const accessToken = await getAccessTokenFromCode(code);
    const email = await getEmailFromAccessToken(accessToken);
    res.locals.email = email;
    res.locals.authMethod = AuthMethod.FACEBOOK;
    return next();
  } catch (error) {
    global.errorMessage = error;
    return res.status(400).redirect('/login');
  }
};
