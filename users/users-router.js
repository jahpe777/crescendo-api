const path = require('path');
const express = require('express');
const xss = require('xss');
const UsersService = require('./users-service');

const usersRouter = express.Router();
const jsonParser = express.json();

const serializeUser = user => ({
  id: subscriber.id,
  email: xss(subscriber.email),
  created: subscriber.created
});

usersRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    UsersService.getAllEmails(knexInstance)
      .then(emails => res.json(emails.map(serializeSubscriber)))
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { email } = req.body;

    if (email == null) {
      return res.status(400).json({
        error: {
          message: `Supply a valid email`
        }
      });
    }
    UsersService.insertEmail(req.app.get('db'), { email: email })
      .then(email => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${email.id}`))
          .json(serializeSubscriber(email));
      })
      .catch(next);
  });

usersRouter
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
    res.json(serializeSubscriber(res.email));
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
    UsersService.deleteEmail(req.app.get('db'), req.params.email_id)
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = usersRouter;
