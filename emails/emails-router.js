const path = require('path');
const express = require('express');
const xss = require('xss');
const EmailsService = require('./emails-service');
const { requireAuth } = require('../middleware/jwt-auth');

const emailsRouter = express.Router();
const jsonParser = express.json();

const serializeEmail = email => ({
  user_id: email.user_id,
  id: email.id,
  email: xss(email.email),
  created: email.created
});

emailsRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    EmailsService.getAllEmails(knexInstance)
      .then(emails => res.json(emails.map(serializeEmail)))
      .catch(next);
  })
  .post(jsonParser, requireAuth, (req, res, next) => {
    const { email } = req.body;

    if (email == null) {
      return res.status(400).json({
        error: {
          message: `Supply a valid email`
        }
      });
    }
    EmailsService.insertEmail(req.app.get('db'), {
      user_id: req.user.id,
      email
    })
      .then(email => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${email.id}`))
          .json(serializeEmail(email));
      })
      .catch(next);
  });

emailsRouter
  .route('/:email_id')
  .all((req, res, next) => {
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
  .get((req, res, next) => {
    res.json(serializeEmail(res.email));
  })
  .delete((req, res, next) => {
    EmailsService.deleteEmail(req.app.get('db'), req.params.email_id)
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = emailsRouter;
