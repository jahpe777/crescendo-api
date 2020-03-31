const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Users Endpoints', () => {
  let db;

  const { testUsers } = helpers.makeUsersFixtures();
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

  afterEach('cleanup', () => helpers.cleanTables(db));

  beforeEach('insert users', () => {
    helpers.seedUsers(db, testUsers);
    return supertest(app)
      .post('/api/auth/login')
      .send(testUsers[0])
      .then(res => {
        authToken = res.body.authToken;
      });
  });

  describe('GET /api/users', () => {
    context('Given there are users in the database', () => {
      it('gets the users from the store', () => {
        return supertest(app)
          .get('/api/users')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200)
          .expect(res => {
            res.body[0].user_email === testUsers[0].user_email;
          });
      });
    });

    context(`Given an XSS attack user`, () => {
      const { maliciousUser, expectedUser } = helpers.makeMaliciousUser(
        testUsers[0]
      );

      beforeEach('insert malicious user', () => {
        return db.into('users').insert(maliciousUser);
      });

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/users`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200)
          .expect(res => {
            expect(res.body[res.body.length - 1]).to.eql(expectedUser);
          });
      });
    });
  });

  describe('GET /api/users/:user_id', () => {
    context(`Given an XSS attack user`, () => {
      const { maliciousUser, expectedUser } = helpers.makeMaliciousUser(
        testUsers[0]
      );

      beforeEach('insert malicious user', () => {
        return db.into('users').insert(maliciousUser);
      });

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/users/${maliciousUser.id}`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200)
          .expect(res => {
            expect(res.body.user).to.eql(expectedUser.user);
          });
      });
    });
  });
});
