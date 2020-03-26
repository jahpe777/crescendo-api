const xss = require('xss');
const moment = require('moment');

const ShowsService = {
  // getAllShows(knex) {
  //   return knex.select('*').from('shows');
  // },

  getAllShowsByUser(knex, user_id) {
    return knex
      .select('*')
      .from('shows')
      .where('user_id', user_id);
  },

  insertShow(knex, newShow) {
    return knex
      .insert(newShow)
      .into('shows')
      .returning('*')
      .then(rows => {
        return rows[0];
      });
  },

  getById(knex, id) {
    return knex
      .from('shows')
      .select('*')
      .where('id', id)
      .first();
  },

  deleteShow(knex, id) {
    return knex('shows')
      .where('id', id)
      .delete();
  },

  serializeShow(show) {
    let formatDate = moment(show.date).format('L');

    return {
      user_id: show.user_id,
      id: show.id,
      date: xss(formatDate),
      city: xss(show.city),
      venue: xss(show.venue),
      created: show.created
    };
  }
};

module.exports = ShowsService;
