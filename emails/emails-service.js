const xss = require('xss');

const EmailsService = {
  getAllEmails(knex) {
    return knex.select('*').from('emails');
  },

  insertEmail(knex, newEmail) {
    return knex
      .insert(newEmail)
      .into('emails')
      .returning('*')
      .then(rows => {
        return rows[0];
      });
  },

  getById(knex, id) {
    return knex
      .from('emails')
      .select('*')
      .where('id', id)
      .first();
  },

  deleteEmail(knex, id) {
    return knex('emails')
      .where('id', id)
      .delete();
  },

  serializeEmail(email) {
    return {
      user_id: email.user_id,
      id: email.id,
      email: xss(email.email),
      created: email.created
    };
  }
};

module.exports = EmailsService;
