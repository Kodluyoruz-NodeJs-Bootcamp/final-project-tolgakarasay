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
    errorMessage: null,
    successMessage: null,
  });
};

export const getSignupPage: RequestHandler = (req, res) => {
  res.status(200).render('signup', {
    page_name: 'signup',
    errorMessage: null,
  });
};
