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
    const { user } = req.body;

    if (user == null) {
      return res.status(400).json({
        error: {
          message: `Supply a valid user`
        }
      });
    }
    UsersService.insertUser(req.app.get('db'), { user: user })
      .then(user => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${user.id}`))
          .json(serializeSubscriber(user));
      })
      .catch(next);
  });

usersRouter
  .route('/:user_id')
  .all((req, res, next) => {
    UsersService.getById(req.app.get('db'), req.params.user_id)
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
  .patch((req, res, next) => {
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
    const { update } = req.body;
    /*
      update:{contactEmail:'test@test.com'}
      update:{youtube:'...',image:'...',facebook:'...'}

    */
    Object.keys(update).forEach(key => {
      if (!possibleKeys.includes(key)) {
        res.status(400).json({ error: `${key} is not a valid key` });
      }
    });

    UsersService.updateMember(
      req.app.get('db'),
      req.params.email_id,
      update
    ).then(() => res.send(204));
  })
  .delete((req, res, next) => {
    UsersService.deleteUser(req.app.get('db'), req.params.user_id)
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = usersRouter;
