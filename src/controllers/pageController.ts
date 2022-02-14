import { RequestHandler } from 'express';
import resetGlobals from '../middlewares/resetGlobalsMiddleware';

//________________________________________________________
//                                                        |
//                   GET INDEX PAGE                       |
//________________________________________________________|
export const getIndexPage: RequestHandler = (req, res) => {
  res.status(200).render('index', {
    page_name: 'index',
  });
  res.on('finish', resetGlobals);
};

//________________________________________________________
//                                                        |
//                   GET LOGIN PAGE                       |
//________________________________________________________|
export const getLoginPage: RequestHandler = (req, res) => {
  res.status(200).render('login', {
    page_name: 'login',
    errorMessage: global.errorMessage,
    successMessage: global.successMessage,
  });
  res.on('finish', resetGlobals);
};

//________________________________________________________
//                                                        |
//                  GET SIGNUP PAGE                       |
//________________________________________________________|
export const getSignupPage: RequestHandler = (req, res) => {
  res.status(200).render('signup', {
    page_name: 'signup',
    errorMessage: global.errorMessage,
  });
  res.on('finish', resetGlobals);
};
