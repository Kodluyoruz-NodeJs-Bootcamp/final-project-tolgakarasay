import * as express from 'express';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { User } from './entity/User';

const app = express();

createConnection()
  .then(async (connection) => {
    // MIDDLEWARES
    app.use(express.static('public'));

    // TEMPLATE ENGINE
    app.set('views', './src/views');
    app.set('view engine', 'ejs');

    console.log('Inserting a new user into the database...');
    const user = new User();
    user.firstName = 'Timber';
    user.lastName = 'Saw';
    user.age = 25;
    await connection.manager.save(user);
    console.log('Saved a new user with id: ' + user.id);

    console.log('Loading users from the database...');
    const users = await connection.manager.find(User);
    console.log('Loaded users: ', users);

    console.log('Here you can setup and run express/koa/any other framework.');

    app.get('/', (req, res) => {
      res.render('index');
    });

    // START THE SERVER
    const port = 3000;
    app.listen(3000, () => {
      console.log(`Server started at port ${port}`);
    });
  })
  .catch((error) => console.log(error));
