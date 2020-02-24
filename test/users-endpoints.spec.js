const knex = require('knex');
const fixtures = require('./users-fixtures');
const app = require('../src/app');

describe('Users Endpoints', () => {
  let db;

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('cleanup', () => db('users').truncate());

  afterEach('cleanup', () => db('users').truncate());

  describe('GET /api/users', () => {
    context(`Given no users`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/users')
          .expect(200, []);
      });
    });

    context('Given there are users in the database', () => {
      const testUsers = fixtures.makeUsersArray();

      beforeEach('insert users', () => {
        return db.into('users').insert(testUsers);
      });

      it('gets the users from the store', () => {
        return supertest(app)
          .get('/api/users')
          .expect(200, testUsers);
      });
    });

    context(`Given an XSS attack user`, () => {
      const { maliciousUser, expectedUser } = fixtures.makeMaliciousUser();

      beforeEach('insert malicious user', () => {
        return db.into('users').insert([maliciousUser]);
      });

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/users`)
          .expect(200)
          .expect(res => {
            expect(res.body[0].user).to.eql(expectedUser.user);
          });
      });
    });
  });

  describe('GET /api/users/:user_id', () => {
    context(`Given no users`, () => {
      it(`responds 404 when user doesn't exist`, () => {
        return supertest(app)
          .get(`/api/users/123`)
          .expect(404, {
            error: { message: `User doesn't exist` }
          });
      });
    });

    context('Given there are users in the database', () => {
      const testUsers = fixtures.makeUsersArray();

      beforeEach('insert users', () => {
        return db.into('users').insert(testUsers);
      });

      it('responds with 200 and the specified user', () => {
        const userId = 2;
        const expectedUser = testUsers[userId - 1];
        return supertest(app)
          .get(`/api/users/${userId}`)
          .expect(200, expectedUser);
      });
    });

    context(`Given an XSS attack user`, () => {
      const { maliciousUser, expectedUser } = fixtures.makeMaliciousUser();

      beforeEach('insert malicious user', () => {
        return db.into('users').insert([maliciousUser]);
      });

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/users/${maliciousUser.id}`)
          .expect(200)
          .expect(res => {
            expect(res.body.user).to.eql(expectedUser.user);
          });
      });
    });
  });

  describe('DELETE /api/users/:user_id', () => {
    context(`Given no users`, () => {
      it(`responds 404 when user doesn't exist`, () => {
        return supertest(app)
          .delete(`/api/users/123`)
          .expect(404, {
            error: { message: `User doesn't exist` }
          });
      });
    });

    context('Given there are users in the database', () => {
      const testUsers = fixtures.makeUsersArray();

      beforeEach('insert users', () => {
        return db.into('users').insert(testUsers);
      });

      it('removes the user by ID from the store', () => {
        const idToRemove = 2;
        const expectedUsers = testUsers.filter(bm => bm.id !== idToRemove);
        return supertest(app)
          .delete(`/api/users/${idToRemove}`)
          .expect(204)
          .then(() =>
            supertest(app)
              .get(`/api/users`)
              .expect(expectedUsers)
          );
      });
    });
  });

  describe('POST /api/users', () => {
    ['user'].forEach(field => {
      const newUser = {
        user_email: 'interpol@gmail.com',
        image:
          'https://media.pitchfork.com/photos/5b1efc8425d5df5ff053e5f1/2:1/w_790/Interpol.jpg'
      };

      it(`responds with 400 missing valid user`, () => {
        delete newUser[field];

        return supertest(app)
          .post(`/api/users`)
          .send(newUser)
          .expect(400, {
            error: { message: `Supply a valid user` }
          });
      });
    });

    it(`responds with 400 invalid 'user' if not a valid user`, () => {
      const invalidUser = {
        user_email: null
      };
      return supertest(app)
        .post(`/api/users`)
        .send(invalidUser)
        .expect(400, {
          error: { message: `Supply a valid user` }
        });
    });

    it('adds a new user to the store', () => {
      const newUser = {
        user_email: 'interpol@gmail.com',
        image:
          'https://media.pitchfork.com/photos/5b1efc8425d5df5ff053e5f1/2:1/w_790/Interpol.jpg'
      };
      return supertest(app)
        .post(`/api/users`)
        .send(newUser)
        .expect(201)
        .expect(res => {
          expect(res.body.user).to.eql(newUser.user);
          expect(res.body).to.have.property('id');
          expect(res.headers.location).to.eql(`/api/users/${res.body.id}`);
        })
        .then(res =>
          supertest(app)
            .get(`/api/users/${res.body.id}`)
            .expect(res.body)
        );
    });

    it('removes XSS attack content from response', () => {
      const { maliciousUser, expectedUser } = fixtures.makeMaliciousUser();
      return supertest(app)
        .post(`/api/users`)
        .send(maliciousUser)
        .expect(201)
        .expect(res => {
          expect(res.body.user).to.eql(expectedUser.user);
        });
    });
  });
});
