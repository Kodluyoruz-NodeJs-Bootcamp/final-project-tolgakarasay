import { RequestHandler } from 'express';
import 'reflect-metadata';
import { User } from '../entity/User';
import { getRepository } from 'typeorm';
import Actor from '../entity/Actor';
import resetGlobals from '../middlewares/resetGlobalsMiddleware';
import ActorLike from '../entity/ActorLike';
import ActorReview from '../entity/ActorReview';
import * as fs from 'fs';

import * as express from 'express';
import { nanoid } from 'nanoid';
const app = express();
const fileUpload = require('express-fileupload');
app.use(fileUpload());

//________________________________________________________
//                                                        |
//                     ADD AN ACTOR                       |
//________________________________________________________|
export const addActor: RequestHandler = async (req, res) => {
  try {
    // Find out which user is adding the actor
    const user = await getRepository(User).findOne({ id: global.userIN });

    // Get actor info
    const { fullname, bio, isShared } = req.body;

    // Validate actor info
    if (!(fullname && bio)) {
      global.errorMessage = 'All input is required';
      return res.status(400).redirect('/users/dashboard');
    }

    let url = undefined;
    // if user has uploaded an image
    if (req.files) {
      // get name and data of uploaded image file
      let imageName = req.files.image['name'];
      const imageData = req.files.image['data'];

      // use nanoid to generate a unique filename for the image
      if (imageName.includes('.')) {
        let fileExtension = imageName.split('.').slice(-1);
        imageName = nanoid(11) + '.' + fileExtension;
      }

      // set upload directory
      const uploadDir = 'public/uploads';

      // if upload directory doesn't exist, create the directory
      if (!fs.existsSync('./' + uploadDir)) {
        fs.mkdirSync('./' + uploadDir);
      }

      // write uploaded image file to the specified directory
      fs.writeFileSync(uploadDir + '/' + imageName, imageData);
      url = '/uploads/' + imageName;
    }
    // Create a new actor
    const actor = getRepository(Actor).create({
      url,
      fullname,
      bio,
      isShared,
      user,
    });

    // Save the new actor to database
    await getRepository(Actor).save(actor);

    // Redirect user to dashboard page
    global.successMessage = 'Actor has been added successfully';
    return res.status(201).redirect('/users/dashboard');
  } catch (err) {
    console.log(err);
    global.errorMessage = err.sqlMessage;
    return res.status(400).redirect('/users/dashboard');
  }
};

//________________________________________________________
//                                                        |
//                   UPDATE AN ACTOR                      |
//________________________________________________________|
export const updateActor: RequestHandler = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const actor = await getRepository(Actor).findOne({
      id,
    });

    if (actor.user.id == global.userIN) {
      // Find out which user is adding the actor
      const user = await getRepository(User).findOne({ id: global.userIN });

      // Get actor info
      const { fullname, bio, isShared } = req.body;

      // Validate actor info
      if (!(fullname && bio)) {
        global.errorMessage = 'Title and bio are both required!';
        return res.status(400).redirect('/users/dashboard');
      }

      actor.fullname = fullname;
      actor.bio = bio;

      if (isShared != undefined) {
        actor.isShared = isShared;
      }

      // if user has uploaded an image
      if (req.files) {
        // get name and data of uploaded image file
        let imageName = req.files.image['name'];
        const imageData = req.files.image['data'];

        // use nanoid to generate a unique filename for the image
        if (imageName.includes('.')) {
          let fileExtension = imageName.split('.').slice(-1);
          imageName = nanoid(11) + '.' + fileExtension;
        }

        // set upload directory
        const uploadDir = 'public/uploads';

        // if upload directory doesn't exist, create the directory
        if (!fs.existsSync('./' + uploadDir)) {
          fs.mkdirSync('./' + uploadDir);
        }

        // write uploaded image file to the specified directory
        fs.writeFileSync(uploadDir + '/' + imageName, imageData);
        const url = '/uploads/' + imageName;

        actor.url = url;
      }

      // Save the new actor to database
      await getRepository(Actor).save(actor);

      // Redirect user to dashboard page
      global.successMessage = 'Actor has been updated successfully';
      return res.status(201).redirect('/users/dashboard');
    } else {
      global.errorMessage = 'Only actor owner can update the actor!';
      return res.status(400).redirect('/users/dashboard');
    }
  } catch (err) {
    console.log(err);
    global.errorMessage = err.sqlMessage;
    return res.status(400).redirect('/users/dashboard');
  }
};

//________________________________________________________
//                                                        |
//               LIST ALL SHARED ACTORS                   |
//________________________________________________________|
export const listAllSharedActors: RequestHandler = async (req, res) => {
  const user = await getRepository(User).findOne({
    id: global.userIN,
  });

  const likesByUser = await getRepository(ActorLike).find({ user: user });
  const actorsLikedByUser = [];

  if (likesByUser[0]) {
    likesByUser.map((item) => {
      actorsLikedByUser.push(item.actor.id);
    });
  }

  console.log(actorsLikedByUser);

  const allSharedActors = await getRepository(Actor).find({
    where: { isShared: true },
    order: { createdAt: 'DESC' },
  });

  return res.render('actors', {
    allSharedActors,
    actorsLikedByUser,
    page_name: 'actors',
  });
};

//________________________________________________________
//                                                        |
//                    DELETE AN ACTOR                     |
//________________________________________________________|
export const deleteActor: RequestHandler = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const actor = await getRepository(Actor).findOne({
      id,
    });
    // Check if user is the owner of the actor
    if (actor.user.id == global.userIN) {
      // remove actor image if exists. But don't delete the default image.
      if (
        fs.existsSync('./public/' + actor.url) &&
        actor.url != '/images/cinema.jpg'
      ) {
        fs.unlinkSync('public/' + actor.url);
      }
      await getRepository(Actor).delete(id);
      global.successMessage = 'Actor has been deleted successfully';
      return res.status(200).redirect('/users/dashboard');
    } else {
      global.errorMessage = 'Only the actor owner can delete the actor.';
      return res.status(400).redirect('/users/dashboard');
    }
  } catch (error) {
    global.errorMessage = error;
    return res.status(400).redirect('/users/dashboard');
  }
};

//________________________________________________________
//                                                        |
//                 TOGGLE ACTOR VISIBILITY                |
//________________________________________________________|
export const toggleActorVisibility: RequestHandler = async (req, res) => {
  try {
    const id = req.params.id;
    const actor = await getRepository(Actor).findOne(id);

    if (actor.isShared) {
      actor.isShared = false;
    } else {
      actor.isShared = true;
    }

    await getRepository(Actor).save(actor);

    global.successMessage = 'Actor visibility been updated successfully';
    return res.status(200).redirect('/users/dashboard');
  } catch (error) {
    global.errorMessage = error;
    return res.status(400).redirect('/users/dashboard');
  }
};

//________________________________________________________
//                                                        |
//                 GET SINGLE ACTOR PAGE                  |
//________________________________________________________|
export const getActor: RequestHandler = async (req, res) => {
  try {
    const actor = await getRepository(Actor).findOne(req.params.id);

    const user = await getRepository(User).findOne({
      id: global.userIN,
    });

    const actorReviews = await getRepository(ActorReview).find({
      actor,
    });

    const likesByUser = await getRepository(ActorLike).find({ user: user });
    const actorsLikedByUser = [];

    if (likesByUser[0]) {
      likesByUser.map((item) => {
        actorsLikedByUser.push(item.actor.id);
      });
    }

    console.log(global.userIN);
    console.log(actor.user.id);
    if (actor.isShared == false && actor.user.id != global.userIN) {
      return res
        .status(403)
        .send(
          "Access Denied. A private actor's page can only be seen by its creator."
        );
    }

    res.status(200).render('actor', {
      page_name: 'actor',
      actor,
      actorReviews,
      actorsLikedByUser,
    });
  } catch (error) {
    global.errorMessage = error;
    console.log(error);
    res.status(400).redirect('/actors');
  }
  res.on('finish', resetGlobals);
};
