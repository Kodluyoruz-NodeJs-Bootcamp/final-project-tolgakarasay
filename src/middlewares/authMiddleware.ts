import { RequestHandler } from 'express';
import * as jwt from 'jsonwebtoken';

// VERIFY JWT
const verifyToken: RequestHandler = async (req, res, next) => {
  // check if a token exists in the cookie
  const token = req.cookies.access_token;
  if (!token) {
    global.userIN = null;
    global.errorMessage = 'Token not found! Login to gain access.';
    return res.status(403).redirect('/login');
  }

  try {
    // Decode the token
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    global.userIN = decoded.id;
  } catch (err) {
    global.userIN = null;
    global.errorMessage = `${err.message}! Login to gain access.`;
    return res.status(401).redirect('/login');
  }
  return next();
};

export default verifyToken;
