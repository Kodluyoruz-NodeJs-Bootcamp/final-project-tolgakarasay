import { RequestHandler } from 'express';
import * as jwt from 'jsonwebtoken';

const signJwt: RequestHandler = (req, res) => {
  try {
    const token = jwt.sign(
      { id: global.userIN, browser: req.headers['user-agent'] },
      process.env.TOKEN_KEY,
      {
        expiresIn: '10m',
      }
    );

    // set cookie
    res.cookie('access_token', token, {
      httpOnly: true,
    });

    return res.redirect('/users/dashboard');
  } catch (err) {
    console.log(err);
  }
};

export default signJwt;
