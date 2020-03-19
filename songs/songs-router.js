const path = require('path');
const express = require('express');
const SongsService = require('./songs-service');
const { requireAuth } = require('../middleware/jwt-auth');
const songsRouter = express.Router();
const jsonBodyParser = express.json();

songsRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    SongsService.getAllSongs(knexInstance)
      .then(songs => res.json(songs.map(SongsService.serializeSong)))
      .catch(next);
  })
  .post(jsonBodyParser, requireAuth, (req, res, next) => {
    const { song } = req.body;

    if (song == null) {
      return res.status(400).json({
        error: {
          message: `Supply a valid link for a song`
        }
      });
    }
    SongsService.insertSong(req.app.get('db'), {
      user_id: req.user.id,
      song
    })
      .then(song => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${song.id}`))
          .json(SongsService.serializeSong(song));
      })
      .catch(next);
  });

songsRouter
  .route('/:song_id')
  .all(requireAuth, (req, res, next) => {
    SongsService.getById(req.app.get('db'), req.params.song_id)
      .then(song => {
        if (!song) {
          return res.status(404).json({
            error: { message: `Song link doesn't exist` }
          });
        }
        res.song = song;
        next();
      })
      .catch(next);
  })
  .get(requireAuth, (req, res, next) => {
    res.json(SongsService.serializeSong(res.song));
  })
  .delete(requireAuth, (req, res, next) => {
    SongsService.deleteSong(req.app.get('db'), req.params.song_id)
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = songsRouter;
