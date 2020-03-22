const path = require('path');
const express = require('express');
const ShowsService = require('./shows-service');
const { requireAuth } = require('../middleware/jwt-auth');
const showsRouter = express.Router();
const jsonBodyParser = express.json();

showsRouter
  .route('/')
  .get(requireAuth, (req, res, next) => {
    const knexInstance = req.app.get('db');
    ShowsService.getAllShowsByUser(knexInstance, req.user.id)
      .then(shows => res.json(shows.map(ShowsService.serializeShow)))
      .catch(next);
  })
  .post(jsonBodyParser, requireAuth, (req, res, next) => {
    const { date, city, venue } = req.body;
    if (date == null || city == null || venue == null) {
      return res.status(400).json({
        error: {
          message: `'date', 'city', & 'venue' are required`
        }
      });
    }
    ShowsService.insertShow(req.app.get('db'), {
      user_id: req.user.id,
      date,
      city,
      venue
    })
      .then(show => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${show.id}`))
          .json(ShowsService.serializeShow(show));
      })
      .catch(next);
  });

showsRouter
  .route('/:show_id')
  .all(requireAuth, (req, res, next) => {
    ShowsService.getById(req.app.get('db'), req.params.show_id)
      .then(show => {
        if (!show) {
          return res.status(404).json({
            error: { message: `Show doesn't exist` }
          });
        }
        res.show = show;
        next();
      })
      .catch(next);
  })
  .get(requireAuth, (req, res, next) => {
    res.json(SongsService.serializeShow(res.show));
  })
  .delete(requireAuth, (req, res, next) => {
    ShowsService.deleteShow(req.app.get('db'), req.params.show_id)
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = showsRouter;
