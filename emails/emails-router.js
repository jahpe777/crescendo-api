const path = require('path');
const express = require('express');
const EmailsService = require('./emails-service');
const { requireAuth } = require('../middleware/jwt-auth');
const emailsRouter = express.Router();
const jsonBodyParser = express.json();

emailsRouter
  .route('/')
  .get(requireAuth, (req, res, next) => {
    const knexInstance = req.app.get('db');
    EmailsService.getAllEmailsByUser(knexInstance, req.user.id)
      .then(emails => res.json(emails.map(EmailsService.serializeEmail)))
      .catch(next);
  })
  .post(jsonBodyParser, (req, res, next) => {
    const { email, band_id } = req.body;

    if (email == null) {
      return res.status(400).json({
        error: {
          message: `Supply a valid email`
        }
      });
    }
    EmailsService.insertEmail(req.app.get('db'), {
      user_id: band_id,
      email
    })
      .then(email => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${email.id}`))
          .json(EmailsService.serializeEmail(email));
      })
      .catch(next);
  });

emailsRouter
  .route('/:email_id')
  .all(requireAuth, (req, res, next) => {
    EmailsService.getById(req.app.get('db'), req.params.email_id)
      .then(email => {
        if (!email) {
          return res.status(404).json({
            error: { message: `Email doesn't exist` }
          });
        }
        res.email = email;
        next();
      })
      .catch(next);
  })
  .get(requireAuth, (req, res, next) => {
    res.json(EmailsService.serializeEmail(res.email));
  })
  .delete(requireAuth, (req, res, next) => {
    EmailsService.deleteEmail(req.app.get('db'), req.params.email_id)
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = emailsRouter;
