const path = require('path');
const express = require('express');
const xss = require('xss');
const VideosService = require('./videos-service');
const { requireAuth } = require('../middleware/jwt-auth');

const videosRouter = express.Router();
const jsonParser = express.json();

const serializeVideo = video => ({
  user_id: video.user_id,
  id: video.id,
  video: xss(video.video),
  created: video.created
});

videosRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    VideosService.getAllVideos(knexInstance)
      .then(videos => res.json(videos.map(serializeVideo)))
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { user_id, video } = req.body;

    if (user_id == null || video == null) {
      return res.status(400).json({
        error: {
          message: `Supply a valid link for a video`
        }
      });
    }
    VideosService.insertVideo(req.app.get('db'), { user_id, video })
      .then(video => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${video.id}`))
          .json(serializeVideo(video));
      })
      .catch(next);
  });

videosRouter
  .route('/:video_id')
  .all((req, res, next) => {
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
  .get((req, res, next) => {
    res.json(serializeVideo(res.video));
  })
  .delete((req, res, next) => {
    VideosService.deleteVideo(req.app.get('db'), req.params.video_id)
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = videosRouter;
