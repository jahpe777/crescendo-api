const express = require('express');
const path = require('path');
const UsersService = require('./users-service');
const usersRouter = express.Router();
const jsonParser = express.json();
const { requireAuth } = require('../middleware/jwt-auth');

usersRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    UsersService.getAllUsers(knexInstance)
      .then(users => res.json(users.map(UsersService.serializeUser)))
      .catch(next);
  })
  .post(requireAuth, jsonParser, (req, res, next) => {
    const { user_email, password } = req.body;

    if (user_email == null) {
      return res.status(400).json({
        error: {
          message: `Supply a valid email`
        }
      });
    }

    const passwordError = UsersService.validatePassword(password);

    if (passwordError) return res.status(400).json({ error: passwordError });

    UsersService.hasUserWithUserName(req.app.get('db'), user_email)
      .then(hasUserWithUserName => {
        if (hasUserWithUserName)
          return res.status(400).json({ error: `Username already taken` });

        return UsersService.hashPassword(password).then(hashedPassword => {
          const newUser = {
            user_email,
            password: hashedPassword,
            created: 'now()'
          };

          return UsersService.insertUser(req.app.get('db'), newUser).then(
            user => {
              res
                .status(201)
                .location(path.posix.join(req.originalUrl, `/${user.id}`))
                .json(UsersService.serializeUser(user));
            }
          );
        });
      })
      .catch(next);
  });

usersRouter
  .route('/:id')
  .all(requireAuth, (req, res, next) => {
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
  .get(requireAuth, (req, res, next) => {
    res.json(UsersService.serializeUser(res.user));
  })
  .patch(requireAuth, jsonParser, (req, res, next) => {
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
  .delete(requireAuth, (req, res, next) => {
    UsersService.deleteUser(req.app.get('db'), req.params.id)
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = usersRouter;
