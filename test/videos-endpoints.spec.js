const knex = require('knex');
const fixtures = require('./videos-fixtures');
const app = require('../src/app');

describe('Videos Endpoints', () => {
  let db;

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('cleanup', () => db('videos').truncate());

  afterEach('cleanup', () => db('videos').truncate());

  describe('GET /api/videos', () => {
    context(`Given no videos`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/videos')
          .expect(200, []);
      });
    });

    context('Given there are videoss in the database', () => {
      const testVideos = fixtures.makeVideossArray();

      beforeEach('insert videos', () => {
        return db.into('videos').insert(testVideos);
      });

      it('gets the videos from the store', () => {
        return supertest(app)
          .get('/api/videos')
          .expect(200, testVideos);
      });
    });

    context(`Given an XSS attack video`, () => {
      const { maliciousVideo, expectedVideo } = fixtures.makeMaliciousVideo();

      beforeEach('insert malicious video', () => {
        return db.into('videos').insert([maliciousVideo]);
      });

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/videos`)
          .expect(200)
          .expect(res => {
            expect(res.body[0].video).to.eql(expectedVideo.video);
          });
      });
    });
  });

  describe('GET /api/videos/:video_id', () => {
    context(`Given no videos`, () => {
      it(`responds 404 when video doesn't exist`, () => {
        return supertest(app)
          .get(`/api/videos/123`)
          .expect(404, {
            error: { message: `Video doesn't exist` }
          });
      });
    });

    context('Given there are videos in the database', () => {
      const testVideos = fixtures.makeVideosArray();

      beforeEach('insert videos', () => {
        return db.into('videos').insert(testVideos);
      });

      it('responds with 200 and the specified video', () => {
        const videoId = 2;
        const expectedVideo = testVideos[videoId - 1];
        return supertest(app)
          .get(`/api/videos/${videoId}`)
          .expect(200, expectedVideo);
      });
    });

    context(`Given an XSS attack video`, () => {
      const { maliciousVideo, expectedVideo } = fixtures.makeMaliciousVideo();

      beforeEach('insert malicious video', () => {
        return db.into('videos').insert([maliciousVideo]);
      });

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/videos/${maliciousVideo.id}`)
          .expect(200)
          .expect(res => {
            expect(res.body.video).to.eql(expectedVideo.video);
          });
      });
    });
  });

  describe('DELETE /api/videos/:video_id', () => {
    context(`Given no videos`, () => {
      it(`responds 404 when video doesn't exist`, () => {
        return supertest(app)
          .delete(`/api/videos/123`)
          .expect(404, {
            error: { message: `video doesn't exist` }
          });
      });
    });

    context('Given there are videos in the database', () => {
      const testVideos = fixtures.makeVideosArray();

      beforeEach('insert videos', () => {
        return db.into('videos').insert(testVideos);
      });

      it('removes the video by ID from the store', () => {
        const idToRemove = 2;
        const expectedVideos = testVideos.filter(bm => bm.id !== idToRemove);
        return supertest(app)
          .delete(`/api/videos/${idToRemove}`)
          .expect(204)
          .then(() =>
            supertest(app)
              .get(`/api/videos`)
              .expect(expectedVideos)
          );
      });
    });
  });

  describe('POST /api/videos', () => {
    ['video'].forEach(field => {
      const newVideo = {
        video: 'https://www.youtube.com/watch?v=baDBCt5OP8g'
      };

      it(`responds with 400 missing valid video`, () => {
        delete newVideo[field];

        return supertest(app)
          .post(`/api/videos`)
          .send(newVideo)
          .expect(400, {
            error: { message: `Supply a valid video` }
          });
      });
    });

    it(`responds with 400 invalid 'video' if not a valid video`, () => {
      const invalidVideo = {
        video: null
      };
      return supertest(app)
        .post(`/api/videos`)
        .send(invalidVideo)
        .expect(400, {
          error: { message: `Supply a valid video` }
        });
    });

    it('adds a new video to the store', () => {
      const newVideo = {
        video: 'https://www.youtube.com/watch?v=YHVwvttoGfA'
      };
      return supertest(app)
        .post(`/api/videos`)
        .send(newVideo)
        .expect(201)
        .expect(res => {
          expect(res.body.video).to.eql(newVideo.video);
          expect(res.body).to.have.property('id');
          expect(res.headers.location).to.eql(`/api/videos/${res.body.id}`);
        })
        .then(res =>
          supertest(app)
            .get(`/api/videos/${res.body.id}`)
            .expect(res.body)
        );
    });

    it('removes XSS attack content from response', () => {
      const { maliciousVideo, expectedVideo } = fixtures.makeMaliciousVideo();
      return supertest(app)
        .post(`/api/videos`)
        .send(maliciousVideo)
        .expect(201)
        .expect(res => {
          expect(res.body.video).to.eql(expectedVideo.video);
        });
    });
  });
});
