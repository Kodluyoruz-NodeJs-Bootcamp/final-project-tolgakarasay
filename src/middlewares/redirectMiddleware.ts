import { RequestHandler } from 'express';

export const isLoggedIn: RequestHandler = (req, res, next) => {
  if (global.userIN) {
    return res.status(400).redirect('/newsfeed');
  }
  next();
};
