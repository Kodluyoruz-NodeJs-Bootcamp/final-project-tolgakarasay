import { json, RequestHandler } from 'express';
import * as jwt from 'jsonwebtoken';

// define an interface for decoded token
interface MyToken {
  id: string;
  browser: string;
}

// Add extra variables to SessionData
declare module 'express-session' {
  interface SessionData {
    browser: String;
    userID: number;
  }
}

// this middleware function is invoked to authenticate the user
const verifyToken: RequestHandler = async (req, res, next) => {
  // check if there is a token in the cookie
  const token = req.cookies.access_token;
  if (!token) {
    global.errorMessage = 'Token not found! Login to gain access.';
    return res.status(403).redirect('/login');
  }

  try {
    // Decode the token
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);

    // Check if cookie's id and browser info match with session's.
    if (
      decoded.id == req.session.userID &&
      decoded.browser == req.headers['user-agent']
    ) {
      return next();
    }

    global.errorMessage = 'Access Denied! Login to gain access.';
    return res.status(403).redirect('/login');
  } catch (err) {
    console.log(err);
    global.errorMessage = `${err.message}! Login to gain access.`;
    return res.status(401).redirect('/login');
  }
};

export default verifyToken;
