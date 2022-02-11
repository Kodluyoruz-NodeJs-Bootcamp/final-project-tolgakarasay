// MODULES
import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as ejs from 'ejs';
import * as methodOverride from 'method-override';
import { createConnection, getConnection } from 'typeorm';
import { TypeormStore } from 'typeorm-store';
require('dotenv').config();
const fileUpload = require('express-fileupload');
import { Session } from './entity/Session';
import userRoute from './routes/userRoute';
import pageRoute from './routes/pageRoute';
import movieRoute from './routes/movieRoute';
import actorRoute from './routes/actorRoute';
import newsfeedRoute from './routes/newsfeedRoute';

const app = express();

// ADD GLOBAL VARIABLES
declare global {
  namespace NodeJS {
    interface Global {
      userIN: number;
      errorMessage: string;
      successMessage: string;
    }
  }
}
global.userIN = null;
global.errorMessage = null;
global.successMessage = null;

(async () => {
  // DB CONNECTION
  await createConnection();

  // MIDDLEWARES
  app.use(express.static('public'));
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(
    methodOverride('_method', {
      methods: ['POST', 'GET'],
    })
  );
  app.use(fileUpload());

  // SESSION
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      store: new TypeormStore({
        repository: getConnection().getRepository(Session),
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 2, // 2 hours
        sameSite: true,
        httpOnly: true,
      },
    })
  );

  // TEMPLATE ENGINE
  app.set('views', './src/views');
  app.set('view engine', 'ejs');

  // ROUTES
  app.use('/', pageRoute);
  app.use('/users', userRoute);
  app.use('/movies', movieRoute);
  app.use('/actors', actorRoute);
  app.use('/newsfeed', newsfeedRoute);

  // START THE SERVER
  const { API_PORT } = process.env;
  app.listen(API_PORT, () => {
    console.log(`Server started at port ${API_PORT}`);
  });
})();
