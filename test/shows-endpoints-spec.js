const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Shows Endpoints', () => {
  let db;

  const { testUsers, testShows } = helpers.makeShowsFixtures();
  let authToken;

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('cleanup', () => helpers.cleanTables(db));

  afterEach('cleanup', () => db('shows').truncate());

  before('insert users', () => {
    helpers.seedUsers(db, testUsers);
    return supertest(app)
      .post('/api/auth/login')
      .send(testUsers[0])
      .then(res => {
        authToken = res.body.authToken;
      });
  });

  describe('GET /api/shows', () => {
    context(`Given no shows`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/shows')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200, []);
      });
    });

    context('Given there are shows in the database', () => {
      beforeEach('insert shows', () => {
        return db.into('shows').insert(testShows);
      });

      it('gets the shows from the store', () => {
        return supertest(app)
          .get('/api/shows')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200, testShows);
      });
    });

    context(`Given an XSS attack show`, () => {
      const { maliciousShow, expectedShow } = helpers.makeMaliciousShow(
        testUsers[0]
      );

      beforeEach('insert malicious show', () => {
        return db.into('shows').insert([maliciousShow]);
      });

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/shows`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200)
          .expect(res => {
            expect(res.body[0].date).to.eql(expectedShow.date);
            expect(res.body[0].venue).to.eql(expectedShow.venue);
          });
      });
    });
  });

  describe('GET /api/shows/:show_id', () => {
    context(`Given no shows`, () => {
      it(`responds 404 when show doesn't exist`, () => {
        return supertest(app)
          .get(`/api/shows/123`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(404, {
            error: { message: `Show does not exist` }
          });
      });
    });

    context('Given there are shows in the database', () => {
      beforeEach('insert shows', () => {
        return db.into('shows').insert(testShows);
      });

      it('responds with 200 and the specified show', () => {
        const showId = 1;
        const expectedShow = testShows[showId - 1];
        return supertest(app)
          .get(`/api/shows/${showId}`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200, expectedShow);
      });
    });

    context(`Given an XSS attack show`, () => {
      const { maliciousShow, expectedShow } = helpers.makeMaliciousShow(
        testUsers[0]
      );

      beforeEach('insert malicious show', () => {
        return db.into('shows').insert([maliciousShow]);
      });

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/shows/${maliciousShow.id}`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200)
          .expect(res => {
            expect(res.body.title).to.eql(expectedShow.title);
            expect(res.body.description).to.eql(expectedShow.description);
          });
      });
    });
  });

  describe('DELETE /api/shows/:show_id', () => {
    context(`Given no shows`, () => {
      it(`responds 404 whe show doesn't exist`, () => {
        return supertest(app)
          .delete(`/api/shows/123`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(404, {
            error: { message: `Show does not exist` }
          });
      });
    });

    context('Given there are shows in the database', () => {
      beforeEach('insert shows', () => {
        return db.into('shows').insert(testShows);
      });

      it('removes the show by ID from the store', () => {
        const idToRemove = 1;
        const expectedShows = testShows.filter(bm => bm.id !== idToRemove);
        return supertest(app)
          .delete(`/api/shows/${idToRemove}`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(204)
          .then(() =>
            supertest(app)
              .get(`/api/shows`)
              .set('Authorization', `Bearer ${authToken}`)
              .expect(expectedShows)
          );
      });
    });
  });

  describe('POST /api/shows', () => {
    ['date', 'city', 'venue'].forEach(field => {
      const newShow = {
        show: {
          date: '01/14/2020',
          city: 'Los Angeles, CA',
          venue: 'Los Globos'
        }
      };

      it(`responds with 400 missing '${field}' if not supplied`, () => {
        delete newShow.show[field];

        return supertest(app)
          .post(`/api/shows`)
          .set('Authorization', `Bearer ${authToken}`)
          .send(newShow)
          .expect(400, {
            error: { message: `'date', 'city', & 'venue' are required` }
          });
      });
    });

    it(`responds with 400 invalid 'venue' if null`, () => {
      const newShowInvalidVenue = {
        show: {
          date: '01/14/2020',
          city: 'Los Angeles, CA',
          venue: null
        }
      };
      return supertest(app)
        .post(`/api/shows`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(newShowInvalidVenue)
        .expect(400, {
          error: { message: `'date', 'city', & 'venue' are required` }
        });
    });

    it(`responds with 400 invalid 'city' if not a valid city`, () => {
      const newShowInvalidCity = {
        show: {
          date: '01/14/2020',
          city: null,
          venue: 'Los Globos'
        }
      };
      return supertest(app)
        .post(`/api/shows`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(newShowInvalidCity)
        .expect(400, {
          error: { message: `'date', 'city', & 'venue' are required` }
        });
    });

    it(`responds with 400 invalid 'date' if not a valid date`, () => {
      const newShowInvalidDate = {
        show: {
          date: null,
          city: 'Los Angeles, CA',
          venue: 'Los Globos'
        }
      };
      return supertest(app)
        .post(`/api/shows`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(newShowInvalidDate)
        .expect(400, {
          error: { message: `'date', 'city', & 'venue' are required` }
        });
    });

    it('adds a new show to the store', () => {
      const newShow = {
        date: '01/14/2020',
        city: 'Los Angeles, CA',
        venue: 'Los Globos'
      };
      return supertest(app)
        .post(`/api/shows`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(newShow)
        .expect(201)
        .expect(res => {
          expect(res.body.date).to.eql(newShow.date);
          expect(res.body.city).to.eql(newShow.city);
          expect(res.body.venue).to.eql(newShow.venue);
          expect(res.body).to.have.property('id');
          expect(res.headers.location).to.eql(`/api/shows/${res.body.id}`);
        })
        .then(res =>
          supertest(app)
            .get(`/api/shows/${res.body.id}`)
            .set('Authorization', `Bearer ${authToken}`)
            .expect(res.body)
        );
    });

    it('removes XSS attack content from response', () => {
      const { maliciousShow, expectedShow } = helpers.makeMaliciousShow(
        testUsers[0]
      );
      const updatedMaliciousShow = { ...maliciousShow };
      return supertest(app)
        .post(`/api/shows`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updatedMaliciousShow)
        .expect(201)
        .expect(res => {
          expect(res.body.date).to.eql(expectedShow.date);
          expect(res.body.venue).to.eql(expectedShow.venue);
        });
    });
  });
});
