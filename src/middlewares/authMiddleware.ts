import { json, RequestHandler } from 'express';
import * as jwt from 'jsonwebtoken';

// VERIFY JWT
const verifyToken: RequestHandler = async (req, res, next) => {
  // check if a token exists in the cookie
  const token = req.cookies.access_token;
  if (!token) {
    global.errorMessage = 'Token not found! Login to gain access.';
    return res.status(403).redirect('/login');
  }

  try {
    // Decode the token
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
  } catch (err) {
    global.errorMessage = `${err.message}! Login to gain access.`;
    return res.status(401).redirect('/login');
  }

  return next();
};

export default verifyToken;
