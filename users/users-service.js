const bcrypt = require('bcryptjs');
const xss = require('xss');

const UsersService = {
  getAllUsers(knex) {
    return knex.select('*').from('users');
  },

  insertUser(knex, newUser) {
    return knex
      .insert(newUser)
      .into('users')
      .returning('*')
      .then(rows => {
        return rows[0];
      });
  },

  getById(knex, id) {
    return knex
      .from('users')
      .select('*')
      .where('id', id)
      .first();
  },

  getBySlug(knex, slug) {
    return knex
      .from('users')
      .select('*')
      .where('band_slug', slug)
      .first();
  },

  generateSlug(knex, band_name, cb) {
    let slug = band_name
      .toLowerCase()
      .replace(' ', '-')
      .trim();
    knex
      .from('users')
      .select('*')
      .where('band_slug', slug)
      .first()
      .then(user => {
        if (user) {
          slug += '-' + Math.ceil(Math.random() * 10000);
        }
        cb(slug);
      });
  },

  deleteUser(knex, id) {
    return knex('users')
      .where('id', id)
      .delete();
  },

  updateUser(knex, id, newUpdate) {
    return knex('users')
      .where({ id })
      .update(newUpdate);
  },

  validatePassword(password) {
    if (password.length < 8) {
      return 'Password must be longer than 8 characters';
    }
    if (password.length > 72) {
      return 'Password must be less than 72 characters';
    }
    if (password.startsWith(' ') || password.endsWith(' ')) {
      return 'Password must not start or end with empty spaces';
    }
    const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/;
    if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
      return 'Password must contain 1 upper case, lower case, number and special character';
    }
    return null;
  },

  hashPassword(password) {
    return bcrypt.hash(password, 12);
  },

  hasUserWithUserName(db, user_email) {
    return db('users')
      .where({ user_email })
      .first()
      .then(user => !!user);
  },

  serializeUser(user) {
    return {
      id: user.id,
      user_email: xss(user.user_email),
      password: xss(user.password),
      image: xss(user.image),
      facebook: xss(user.facebook),
      twitter: xss(user.twitter),
      instagram: xss(user.instagram),
      youtube: xss(user.youtube),
      soundcloud: xss(user.soundcloud),
      bandcamp: xss(user.bandcamp),
      contact_email: xss(user.contact_email),
      created: new Date(user.created),
      band_name: xss(user.band_name),
      band_slug: xss(user.band_slug)
    };
  }
};

module.exports = UsersService;
