const xss = require('xss');

const VideosService = {
  getAllVideos(knex) {
    return knex.select('*').from('videos');
  },

  getAllVideosByUser(knex, user_id) {
    return knex
      .select('*')
      .from('videos')
      .where('user_id', user_id);
  },

  insertVideo(knex, newVideo) {
    return knex
      .insert(newVideo)
      .into('videos')
      .returning('*')
      .then(rows => {
        return rows[0];
      });
  },

  getById(knex, id) {
    return knex
      .from('videos')
      .select('*')
      .where('id', id)
      .first();
  },

  deleteVideo(knex, id) {
    return knex('videos')
      .where('id', id)
      .delete();
  },

  serializeVideo(video) {
    return {
      user_id: video.user_id,
      id: video.id,
      video: xss(video.video),
      created: video.created
    };
  }
};

module.exports = VideosService;
