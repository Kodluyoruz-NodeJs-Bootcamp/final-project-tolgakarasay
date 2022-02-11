import { RequestHandler } from 'express';

export const isLoggedIn: RequestHandler = (req, res, next) => {
  if (global.userIN) {
    return res.redirect('/newsfeed');
  }
  next();
};
