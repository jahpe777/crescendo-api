const path = require('path');
const express = require('express');
const xss = require('xss');
const UsersService = require('./users-service');

const usersRouter = express.Router();
const jsonParser = express.json();

const serializeUser = user => ({
  id: user.id,
  user_email: xss(user.user_email),
  image: xss(user.image),
  facebook: xss(user.facebook),
  twitter: xss(user.twitter),
  instagram: xss(user.instagram),
  youtube: xss(user.youtube),
  soundcloud: xss(user.soundcloud),
  bandcamp: xss(user.bandcamp),
  contact_email: xss(user.contact_email),
  created: user.created
});

usersRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    UsersService.getAllUsers(knexInstance)
      .then(users => res.json(users.map(serializeUser)))
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { user_email } = req.body;

    if (user_email == null) {
      return res.status(400).json({
        error: {
          message: `Supply a valid user`
        }
      });
    }
    UsersService.insertUser(req.app.get('db'), { user_email })
      .then(user => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${user.id}`))
          .json(serializeUser(user));
      })
      .catch(next);
  });

usersRouter
  .route('/:id')
  .all((req, res, next) => {
    UsersService.getById(req.app.get('db'), req.params.id)
      .then(user => {
        if (!user) {
          return res.status(404).json({
            error: { message: `User doesn't exist` }
          });
        }
        res.user = user;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(serializeUser(res.user));
  })
  .patch(jsonParser, (req, res, next) => {
    const possibleKeys = [
      'image',
      'facebook',
      'twitter',
      'instagram',
      'youtube',
      'soundcloud',
      'bandcamp',
      'contact_email'
    ];
    const newUpdate = req.body;
    /*
      newUpdate:{contactEmail:'test@test.com'}
      newUpdate:{youtube:'...',image:'...',facebook:'...'}
    */
    Object.keys(newUpdate).forEach(key => {
      if (!possibleKeys.includes(key)) {
        res.status(400).json({ error: `${key} is not a valid key` });
      }
    });

    UsersService.updateUser(req.app.get('db'), req.params.id, newUpdate).then(
      () => res.send(204)
    );
  })
  .delete((req, res, next) => {
    UsersService.deleteUser(req.app.get('db'), req.params.id)
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = usersRouter;
