import { RequestHandler } from 'express';

// render index page
export const getIndexPage: RequestHandler = (req, res) => {
  res.status(200).render('index', {
    page_name: 'index',
  });
};
