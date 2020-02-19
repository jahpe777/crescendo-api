const SongsService = {
  getAllSongs(knex) {
    return knex.select('*').from('songs');
  },

  insertSong(knex, newSong) {
    return knex
      .insert(newSong)
      .into('songs')
      .returning('*')
      .then(rows => {
        return rows[0];
      });
  },

  getById(knex, id) {
    return knex
      .from('songs')
      .select('*')
      .where('id', id)
      .first();
  },

  deleteSong(knex, id) {
    return knex('songs')
      .where('id', id)
      .delete();
  }
};

module.exports = SongsService;
