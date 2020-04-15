const express = require('express');
const path = require('path');
const UsersService = require('./users-service');
const VideosService = require('../videos/videos-service');
const SongsService = require('../songs/songs-service');
const ShowsService = require('../shows/shows-service');
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

    Object.keys(newUpdate).forEach(key => {
      if (!possibleKeys.includes(key)) {
        res.status(400).json({ error: `${key} is not a valid key` });
      }
    });

    UsersService.updateUser(req.app.get('db'), req.user.id, newUpdate).then(
      () => res.send(204)
    );
  })
  .post(jsonParser, (req, res, next) => {
    const { user_email, band_name, password = '' } = req.body;
    if (user_email == null || band_name == null) {
      return res.status(400).json({
        error: {
          message: `Supply a valid email and band name`
        }
      });
    }

    const passwordError = UsersService.validatePassword(password);

    if (passwordError) return res.status(400).json({ error: passwordError });

    UsersService.hasUserWithUserName(req.app.get('db'), user_email)
      .then(hasUserWithUserName => {
        if (hasUserWithUserName)
          return res.status(400).json({ error: `Username already taken` });

        UsersService.generateSlug(req.app.get('db'), band_name, band_slug => {
          return UsersService.hashPassword(password).then(hashedPassword => {
            const newUser = {
              user_email,
              band_name,
              band_slug,
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
        });
      })
      .catch(next);
  });

usersRouter.route('/loggedin').get(requireAuth, (req, res, next) => {
  res.json(UsersService.serializeUser(req.user));
});

usersRouter.route('/details/:bandSlug').get((req, res, next) => {
  let knexInstance = req.app.get('db');
  UsersService.getBySlug(knexInstance, req.params.bandSlug).then(band => {
    VideosService.getAllVideosByUser(knexInstance, band.id).then(videos => {
      SongsService.getAllSongsByUser(knexInstance, band.id).then(songs => {
        ShowsService.getAllShowsByUser(knexInstance, band.id).then(shows => {
          band = UsersService.serializeUser(band);
          band.videos = videos.map(VideosService.serializeVideo);
          band.songs = songs.map(SongsService.serializeSong);
          band.shows = shows.map(ShowsService.serializeShow);
          res.json(band);
        });
      });
    });
  });
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
  .delete(requireAuth, (req, res, next) => {
    UsersService.deleteUser(req.app.get('db'), req.params.id)
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = usersRouter;
