require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const usersRouter = require('../users/users-router');
const showsRouter = require('../shows/shows-router');
const videosRouter = require('../videos/videos-router');
const songsRouter = require('../songs/songs-router');
const emailsRouter = require('../emails/emails-router');
const authRouter = require('../auth/auth-router');

const app = express();

const morganOption = NODE_ENV === 'production' ? 'tiny' : 'common';

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.use(morgan(morganOption));
app.use(cors());
app.use(helmet());

app.use('/api/users', usersRouter);
app.use('/api/emails', emailsRouter);
app.use('/api/shows', showsRouter);
app.use('/api/videos', videosRouter);
app.use('/api/songs', songsRouter);
app.use('/api/auth', authRouter);

module.exports = app;
