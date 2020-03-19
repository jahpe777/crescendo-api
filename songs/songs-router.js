const path = require('path');
const express = require('express');
const xss = require('xss');
const SongsService = require('./songs-service');
const { requireAuth } = require('../middleware/jwt-auth');

const songsRouter = express.Router();
const jsonParser = express.json();

const serializeSong = song => ({
  user_id: song.user_id,
  id: song.id,
  song: xss(song.song),
  created: song.created
});

songsRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    SongsService.getAllSongs(knexInstance)
      .then(songs => res.json(songs.map(serializeSong)))
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { user_id, song } = req.body;

    if (user_id == null || song == null) {
      return res.status(400).json({
        error: {
          message: `Supply a valid link for a song`
        }
      });
    }
    SongsService.insertSong(req.app.get('db'), { user_id, song })
      .then(song => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${song.id}`))
          .json(serializeSong(song));
      })
      .catch(next);
  });

songsRouter
  .route('/:song_id')
  .all((req, res, next) => {
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
  .get((req, res, next) => {
    res.json(serializeSong(res.song));
  })
  .delete((req, res, next) => {
    SongsService.deleteSong(req.app.get('db'), req.params.song_id)
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = songsRouter;
