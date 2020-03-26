const path = require('path');
const express = require('express');
const VideosService = require('./videos-service');
const { requireAuth } = require('../middleware/jwt-auth');
const videosRouter = express.Router();
const jsonBodyParser = express.json();

videosRouter
  .route('/')
  .get(requireAuth, (req, res, next) => {
    const knexInstance = req.app.get('db');
    VideosService.getAllVideosByUser(knexInstance, req.user.id)
      .then(videos => res.json(videos.map(VideosService.serializeVideo)))
      .catch(next);
  })
  .post(jsonBodyParser, requireAuth, (req, res, next) => {
    const { video } = req.body;

    if (video == null) {
      return res.status(400).json({
        error: {
          message: `Supply a valid link for a video`
        }
      });
    }
    VideosService.insertVideo(req.app.get('db'), {
      user_id: req.user.id,
      video
    })
      .then(video => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${video.id}`))
          .json(VideosService.serializeVideo(video));
      })
      .catch(next);
  });

videosRouter
  .route('/:video_id')
  .all(requireAuth, (req, res, next) => {
    VideosService.getById(req.app.get('db'), req.params.video_id)
      .then(video => {
        if (!video) {
          return res.status(404).json({
            error: { message: `Video link doesn't exist` }
          });
        }
        res.video = video;
        next();
      })
      .catch(next);
  })
  .get(requireAuth, (req, res, next) => {
    res.json(VideosService.serializeVideo(res.video));
  })
  .delete(requireAuth, (req, res, next) => {
    VideosService.deleteVideo(req.app.get('db'), req.params.video_id)
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = videosRouter;
