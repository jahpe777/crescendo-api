const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Protected endpoints', function() {
  let db;

  const {
    testUsers,
    testShows,
    testVideos,
    testSongs,
    testEmails
  } = helpers.makeUsersFixtures();
  // const { testShows } = helpers.makeShowsFixtures();
  // const { testVideos } = helpers.makeVideosFixtures();
  // const { testSongs } = helpers.makeSongsFixtures();
  // const { testEmails } = helpers.makeEmailsFixtures();

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('cleanup', () => helpers.cleanTables(db));

  afterEach('cleanup', () => helpers.cleanTables(db));

  beforeEach('insert content', () => {
    helpers.seedUsers(db, testUsers),
      helpers.seedShowsTables(db, testUsers, testShows),
      helpers.seedVideosTables(db, testUsers, testVideos),
      helpers.seedSongsTables(db, testUsers, testSongs),
      helpers.seedEmailsTables(db, testUsers, testEmails);
  });

  const protectedEndpoints = [
    {
      name: `POST /api/auth/login`,
      path: '/api/auth/login',
      method: supertest(app).post
    },
    {
      name: 'POST /api/auth/refresh',
      path: '/api/auth/refresh',
      method: supertest(app).post
    },
    {
      name: 'GET /api/users',
      path: '/api/users',
      method: supertest(app).get
    },
    {
      name: 'GET /api/users/:user_id',
      path: '/api/users/1',
      method: supertest(app).get
    },
    {
      name: 'DELETE /api/users/:user_id',
      path: '/api/users/1',
      method: supertest(app).post
    },
    {
      name: 'POST /api/users',
      path: '/api/users',
      method: supertest(app).post
    },
    {
      name: 'GET /api/shows',
      path: '/api/shows',
      method: supertest(app).post
    },
    {
      name: 'GET /api/shows/:show_id',
      path: '/api/shows/1',
      method: supertest(app).post
    },
    {
      name: 'DELETE /api/shows/:show_id',
      path: '/api/shows/1',
      method: supertest(app).post
    },
    {
      name: 'POST /api/shows',
      path: '/api/shows',
      method: supertest(app).post
    },
    {
      name: 'GET /api/videos',
      path: '/api/videos',
      method: supertest(app).post
    },
    {
      name: 'GET /api/videos/:video_id',
      path: '/api/videos/1',
      method: supertest(app).post
    },
    {
      name: 'DELETE /api/videos/:video_id',
      path: '/api/videos/1',
      method: supertest(app).post
    },
    {
      name: 'POST /api/videos',
      path: '/api/videos',
      method: supertest(app).post
    },
    {
      name: 'GET /api/songs',
      path: '/api/songs',
      method: supertest(app).post
    },
    {
      name: 'GET /api/songs/:song_id',
      path: '/api/songs/1',
      method: supertest(app).post
    },
    {
      name: 'DELETE /api/songs/:song_id',
      path: '/api/songs/1',
      method: supertest(app).post
    },
    {
      name: 'POST /api/songs',
      path: '/api/songs',
      method: supertest(app).post
    },
    {
      name: 'GET /api/emails',
      path: '/api/emails',
      method: supertest(app).post
    },
    {
      name: 'GET /api/emails/:email_id',
      path: '/api/emails',
      method: supertest(app).post
    },
    {
      name: 'DELETE /api/emails/:email_id',
      path: '/api/emails/1',
      method: supertest(app).post
    },
    {
      name: 'POST /api/emails',
      path: '/api/emails',
      method: supertest(app).post
    }
  ];

  protectedEndpoints.forEach(endpoint => {
    describe(endpoint.name, () => {
      it(`responds 401 'Missing bearer token' when no bearer token`, () => {
        return endpoint
          .method(endpoint.path)
          .expect(401, { error: `Missing bearer token` });
      });

      it(`responds 401 'Unauthorized request' when invalid JWT secret`, () => {
        const validUser = testUsers[0];
        const invalidSecret = 'bad-secret';
        return endpoint
          .method(endpoint.path)
          .set(
            'Authorization',
            helpers.makeAuthHeader(validUser, invalidSecret)
          )
          .expect(401, { error: `Unauthorized request` });
      });

      it(`responds 401 'Unauthorized request' when invalid sub in payload`, () => {
        const invalidUser = { user_email: 'user-not-existy', id: 1 };
        return endpoint
          .method(endpoint.path)
          .set('Authorization', helpers.makeAuthHeader(invalidUser))
          .expect(401, { error: `Unauthorized request` });
      });
    });
  });
});
