const knex = require('knex');
const fixtures = require('./songs-fixtures');
const app = require('../src/app');

describe('Songs Endpoints', () => {
  let db;

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('cleanup', () => db('songs').truncate());

  afterEach('cleanup', () => db('songs').truncate());

  describe('GET /api/songs', () => {
    context(`Given no songs`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/songs')
          .expect(200, []);
      });
    });

    context('Given there are songs in the database', () => {
      const testSongs = fixtures.makeSongsArray();

      beforeEach('insert songs', () => {
        return db.into('songs').insert(testSongs);
      });

      it('gets the songs from the store', () => {
        return supertest(app)
          .get('/api/songs')
          .expect(200, testSongs);
      });
    });

    context(`Given an XSS attack song`, () => {
      const { maliciousSong, expectedSong } = fixtures.makeMaliciousSong();

      beforeEach('insert malicious song', () => {
        return db.into('songs').insert([maliciousSong]);
      });

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/songs`)
          .expect(200)
          .expect(res => {
            expect(res.body[0].song).to.eql(expectedSong.song);
          });
      });
    });
  });

  describe('GET /api/songs/:song_id', () => {
    context(`Given no songs`, () => {
      it(`responds 404 when song doesn't exist`, () => {
        return supertest(app)
          .get(`/api/songs/123`)
          .expect(404, {
            error: { message: `Song doesn't exist` }
          });
      });
    });

    context('Given there are songs in the database', () => {
      const testSongs = fixtures.makeSongsArray();

      beforeEach('insert songs', () => {
        return db.into('songs').insert(testSongs);
      });

      it('responds with 200 and the specified song', () => {
        const songId = 2;
        const expectedSong = testSongs[songId - 1];
        return supertest(app)
          .get(`/api/songs/${songId}`)
          .expect(200, expectedSong);
      });
    });

    context(`Given an XSS attack song`, () => {
      const { maliciousSong, expectedSong } = fixtures.makeMaliciousSong();

      beforeEach('insert malicious song', () => {
        return db.into('songs').insert([maliciousSong]);
      });

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/songs/${maliciousSong.id}`)
          .expect(200)
          .expect(res => {
            expect(res.body.song).to.eql(expectedSong.song);
          });
      });
    });
  });

  describe('DELETE /api/songs/:song_id', () => {
    context(`Given no songs`, () => {
      it(`responds 404 when song doesn't exist`, () => {
        return supertest(app)
          .delete(`/api/songs/123`)
          .expect(404, {
            error: { message: `Song doesn't exist` }
          });
      });
    });

    context('Given there are songs in the database', () => {
      const testSongs = fixtures.makeSongsArray();

      beforeEach('insert songs', () => {
        return db.into('songs').insert(testSongs);
      });

      it('removes the song by ID from the store', () => {
        const idToRemove = 2;
        const expectedSongs = testSongs.filter(bm => bm.id !== idToRemove);
        return supertest(app)
          .delete(`/api/songs/${idToRemove}`)
          .expect(204)
          .then(() =>
            supertest(app)
              .get(`/api/songs`)
              .expect(expectedSongs)
          );
      });
    });
  });

  describe('POST /api/songs', () => {
    ['song'].forEach(field => {
      const newSong = {
        song:
          'https://bandcamp.com/EmbeddedPlayer/track=2640474834/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/transparent=true/'
      };

      it(`responds with 400 missing valid song`, () => {
        delete newSong[field];

        return supertest(app)
          .post(`/api/songs`)
          .send(newSong)
          .expect(400, {
            error: { message: `Supply a valid song` }
          });
      });
    });

    it(`responds with 400 invalid 'song' if not a valid song`, () => {
      const invalidSong = {
        song: null
      };
      return supertest(app)
        .post(`/api/songs`)
        .send(invalidSong)
        .expect(400, {
          error: { message: `Supply a valid song` }
        });
    });

    it('adds a new song to the store', () => {
      const newSong = {
        song:
          'https://bandcamp.com/EmbeddedPlayer/track=2640474834/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/transparent=true/'
      };
      return supertest(app)
        .post(`/api/songs`)
        .send(newSong)
        .expect(201)
        .expect(res => {
          expect(res.body.song).to.eql(newSong.song);
          expect(res.body).to.have.property('id');
          expect(res.headers.location).to.eql(`/api/songs/${res.body.id}`);
        })
        .then(res =>
          supertest(app)
            .get(`/api/songs/${res.body.id}`)
            .expect(res.body)
        );
    });

    it('removes XSS attack content from response', () => {
      const { maliciousSong, expectedSong } = fixtures.makeMaliciousSong();
      return supertest(app)
        .post(`/api/songs`)
        .send(maliciousSong)
        .expect(201)
        .expect(res => {
          expect(res.body.song).to.eql(expectedSong.song);
        });
    });
  });
});
