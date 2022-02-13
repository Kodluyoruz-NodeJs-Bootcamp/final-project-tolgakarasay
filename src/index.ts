// MODULES
import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import * as methodOverride from 'method-override';
import { createConnection } from 'typeorm';
require('dotenv').config();
const fileUpload = require('express-fileupload');
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
  app.use(express.json());

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
