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
    // context(`Given no users`, () => {
    //   it(`responds 404 when user doesn't exist`, () => {
    //     return supertest(app)
    //       .get(`/api/users/123`)
    //       .set('Authorization', `Bearer ${authToken}`)
    //       .expect(404, {
    //         error: { message: `User doesn't exist` }
    //       });
    //   });
    // });

    // context('Given there are users in the database', () => {
    //   it('responds with 200 and the specified user', () => {
    //     const userId = 1;
    //     const expectedUser = testUsers[userId - 1];
    //     return supertest(app)
    //       .get(`/api/users/${userId}`)
    //       .set('Authorization', `Bearer ${authToken}`)
    //       .expect(200)
    //       .expect(res => {
    //         expect(res.body).to.have.property('id');
    //         expect(res.body.id).to.eql(userId);
    //       });
    //   });
    // });

    context(`Given an XSS attack user`, () => {
      const { maliciousUser, expectedUser } = helpers.makeMaliciousUser(
        testUsers[0]
      );

      beforeEach('insert malicious user', () => {
        return db.into('users').insert(maliciousUser);
      });

      it('removes XSS attack content', () => {
        console.log(authToken);
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

  // describe('DELETE /api/users/:user_id', () => {
  // context(`Given no users`, () => {
  //   it(`responds 404 when user doesn't exist`, () => {
  //     return supertest(app)
  //       .delete(`/api/users/123`)
  //       .set('Authorization', `Bearer ${authToken}`)
  //       .expect(404, {
  //         error: { message: `User doesn't exist` }
  //       });
  //   });
  // });

  //   context('Given there are users in the database', () => {
  //     it('removes the user by ID from the store', () => {
  //       const idToRemove = 1;
  //       const expectedUsers = testUsers.filter(bm => bm.id !== idToRemove);
  //       console.log(authToken, '-1-');
  //       return supertest(app)
  //         .delete(`/api/users/${idToRemove}`)
  //         .set('Authorization', `Bearer ${authToken}`)
  //         .expect(204)
  //         .then(() => {
  //           console.log(authToken, '-2-');
  //           return supertest(app)
  //             .get(`/api/users`)
  //             .set('Authorization', `Bearer ${authToken}`)
  //             .expect(expectedUsers);
  //         });
  //     });
  //   });
  // });

  describe('POST /api/users', () => {
    ['user_email', 'password'].forEach(field => {
      const newUser = {
        user_email: 'interpol@gmail.com',
        password: 'T3esting@234'
      };

      it(`responds with 400 missing valid user`, () => {
        delete newUser[field];

        return supertest(app)
          .post(`/api/users`)
          .send(newUser)
          .expect(400);
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
          error: { message: `Supply a valid email` }
        });
    });

    it('adds a new user to the store', () => {
      const newUser = {
        user_email: 'interpol@gmail.com',
        password: 'Testing1234!'
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
            .set('Authorization', `Bearer ${authToken}`)
            .expect(res.body)
        );
    });
  });
});
