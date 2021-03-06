import { RequestHandler } from 'express';
import * as jwt from 'jsonwebtoken';

//________________________________________________________
//                                                        |
//                 SIGN JSON WEB TOKEN                    |
//________________________________________________________|
const signJwt: RequestHandler = (req, res) => {
  try {
    const token = jwt.sign(
      { id: global.userIN, browser: req.headers['user-agent'] },
      process.env.TOKEN_KEY,
      {
        expiresIn: '2h',
      }
    );

    // set cookie
    res.cookie('access_token', token, {
      httpOnly: true,
    });

    return res.status(200).redirect('/users/dashboard');
  } catch (err) {
    global.errorMessage = err;
    res.status(400).redirect('/login');
  }
};

export default signJwt;
