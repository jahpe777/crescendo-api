const VideosService = {
  getAllVideos(knex) {
    return knex.select('*').from('videos');
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
  }
};

module.exports = VideosService;
