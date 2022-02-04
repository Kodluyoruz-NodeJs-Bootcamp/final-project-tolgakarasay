import { RequestHandler } from 'express';

// render index page
export const getIndexPage: RequestHandler = (req, res) => {
  res.status(200).render('index', {
    page_name: 'index',
  });
};

export const getLoginPage: RequestHandler = (req, res) => {
  res.status(200).render('login', {
    page_name: 'login',
  });
};

export const getSignupPage: RequestHandler = (req, res) => {
  res.status(200).render('signup', {
    page_name: 'signup',
  });
};
