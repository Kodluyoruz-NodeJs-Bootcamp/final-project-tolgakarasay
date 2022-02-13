import { RequestHandler } from 'express';
import resetGlobals from '../middlewares/resetGlobalsMiddleware';

// GET INDEX PAGE
export const getIndexPage: RequestHandler = (req, res) => {
  res.status(200).render('index', {
    page_name: 'index',
  });
  res.on('finish', resetGlobals);
};

// GET LOGIN PAGE
export const getLoginPage: RequestHandler = (req, res) => {
  res.status(200).render('login', {
    page_name: 'login',
    errorMessage: global.errorMessage,
    successMessage: global.successMessage,
  });
  res.on('finish', resetGlobals);
};

// GET SIGNUP PAGE
export const getSignupPage: RequestHandler = (req, res) => {
  res.status(200).render('signup', {
    page_name: 'signup',
    errorMessage: global.errorMessage,
  });
  res.on('finish', resetGlobals);
};
