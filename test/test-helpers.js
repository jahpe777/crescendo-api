const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function makeUsersArray() {
  return [
    {
      id: 1,
      user_email: 'beachhouse@gmail.com',
      password: 'password',
      image:
        'https://media.npr.org/assets/img/2013/02/01/edit-beach-house-credit-liz-flyntz_wide-e1c6a0ec6d040d71027d76c447304756b2fbf3e7.jpg?s=1400',
      facebook: 'https://www.facebook.com/beachhouse/',
      twitter: 'https://twitter.com/beaccchhoussse?lang=en',
      instagram: 'https://www.instagram.com/beaccchhoussse/?hl=en',
      youtube: 'https://www.youtube.com/channel/UCN-jxm11fOETNF5JrZsATCg',
      soundcloud: 'https://soundcloud.com/beachhouse',
      bandcamp: 'https://beachhouse.bandcamp.com/',
      contact_email: 'beach@gmail.com',
      created: new Date('2029-01-22T16:28:32.615Z')
    },
    {
      id: 2,
      user_email: 'grizzlybear@gmail.com',
      password: 'password',
      image:
        'https://media.npr.org/assets/img/2012/10/19/gbtomhinesonline1_20120910_164358_wide-3be89be66fe4f26b79bb6121dcef343dd942d722.jpg?s=1400',
      facebook: 'https://www.facebook.com/grizzlybear/',
      twitter: 'https://twitter.com/grizzlybear?lang=en',
      instagram: 'https://www.instagram.com/grizzlybear/?hl=en',
      youtube: 'https://www.youtube.com/channel/UCi6v8K4tGMwmXc_ND4DMVoQ',
      soundcloud: 'https://soundcloud.com/grizzlybearband',
      bandcamp: 'https://grizzlybearbrooklyn.bandcamp.com/',
      contact_email: 'grizzly@gmail.com',
      created: new Date('2029-01-22T16:28:32.615Z')
    }
  ];
}

function makeShowsArray(users) {
  return [
    {
      user_id: 1,
      id: 1,
      date: '2020-04-12',
      city: 'Orlando, FL',
      venue: 'Boo',
      created: new Date('2029-01-22T16:28:32.615Z')
    },
    {
      user_id: 2,
      id: 2,
      date: '2020-05-12',
      city: 'Miami, FL',
      venue: 'Who',
      created: new Date('2029-01-22T16:28:32.615Z')
    }
  ];
}

function makeVideosArray(users) {
  return [
    {
      user_id: 1,
      id: 1,
      video: 'https://www.youtube.com/embed/OS6duOoxctw',
      created: new Date('2029-01-22T16:28:32.615Z')
    },
    {
      user_id: 2,
      id: 3,
      text: 'https://www.youtube.com/embed/OJpC9JqSnJk',
      created: new Date('2029-01-22T16:28:32.615Z')
    }
  ];
}

function makeSongsArray(users) {
  return [
    {
      user_id: 1,
      id: 1,
      video:
        'https://bandcamp.com/EmbeddedPlayer/album=1030921102/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/transparent=true/',
      created: new Date('2029-01-22T16:28:32.615Z')
    },
    {
      user_id: 2,
      id: 2,
      video:
        'https://bandcamp.com/EmbeddedPlayer/album=4076584652/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/transparent=true/',
      created: new Date('2029-01-22T16:28:32.615Z')
    }
  ];
}

function makeEmailsArray(users) {
  return [
    {
      user_id: 1,
      id: 1,
      email: 'house@gmail.com',
      created: new Date('2029-01-22T16:28:32.615Z')
    },
    {
      user_id: 2,
      id: 6,
      email: 'bear@gmail.com',
      created: new Date('2029-01-22T16:28:32.615Z')
    }
  ];
}

function makeExpectedShow(users, show) {
  const showUser = users.find(user => user.id === show.user_id);

  // const number_of_comments = comments.filter(
  //   comment => comment.article_id === article.id
  // ).length;

  return {
    user_id: show.user_id,
    id: show.id,
    date: show.date,
    city: show.city,
    venue: show.venue,
    created: show.created.toISOString(),
    showUser: {
      id: showUser.id,
      user_email: showUser.user_email,
      password: showUser.password,
      image: showUser.image,
      facebook: showUser.facebook,
      twitter: showUser.twitter,
      instagram: showUser.instagram,
      youtube: showUser.youtube,
      soundcloud: showUser.soundcloud,
      bandcamp: showUser.bandcamp,
      contact_email: showUser.contact_email,
      created: showUser.created.toISOString(),
      modified: showUser.modified || null
    }
  };
}

function makeExpectedVideo(users, video) {
  const videoUser = users.find(user => user.id === video.user_id);

  // const number_of_comments = comments.filter(
  //   comment => comment.article_id === article.id
  // ).length;

  return {
    user_id: video.user_id,
    id: video.id,
    video: video.video,
    created: video.created.toISOString(),
    videoUser: {
      id: videoUser.id,
      user_email: videoUser.user_email,
      password: videoUser.password,
      image: videoUser.image,
      facebook: videoUser.facebook,
      twitter: videoUser.twitter,
      instagram: videoUser.instagram,
      youtube: videoUser.youtube,
      soundcloud: videoUser.soundcloud,
      bandcamp: videoUser.bandcamp,
      contact_email: videoUser.contact_email,
      created: videoUser.created.toISOString(),
      modified: videoUser.modified || null
    }
  };
}

function makeExpectedSong(users, song) {
  const songUser = users.find(user => user.id === song.user_id);

  // const number_of_comments = comments.filter(
  //   comment => comment.article_id === article.id
  // ).length;

  return {
    user_id: song.user_id,
    id: song.id,
    song: song.song,
    created: song.created.toISOString(),
    songUser: {
      id: songUser.id,
      user_email: songUser.user_email,
      password: songUser.password,
      image: songUser.image,
      facebook: songUser.facebook,
      twitter: songUser.twitter,
      instagram: songUser.instagram,
      youtube: songUser.youtube,
      soundcloud: songUser.soundcloud,
      bandcamp: songUser.bandcamp,
      contact_email: songUser.contact_email,
      created: songUser.created.toISOString(),
      modified: songUser.modified || null
    }
  };
}

function makeExpectedEmail(users, email) {
  const emailUser = users.find(user => user.id === email.user_id);

  // const number_of_comments = comments.filter(
  //   comment => comment.article_id === article.id
  // ).length;

  return {
    user_id: email.user_id,
    id: email.id,
    email: email.email,
    created: email.created.toISOString(),
    emailUser: {
      id: emailUser.id,
      user_email: emailUser.user_email,
      password: emailUser.password,
      image: emailUser.image,
      facebook: emailUser.facebook,
      twitter: emailUser.twitter,
      instagram: emailUser.instagram,
      youtube: emailUser.youtube,
      soundcloud: emailUser.soundcloud,
      bandcamp: emailUser.bandcamp,
      contact_email: emailUser.contact_email,
      created: emailUser.created.toISOString(),
      modified: emailUser.modified || null
    }
  };
}

// function makeExpectedArticleComments(users, articleId, comments) {
//   const expectedComments = comments.filter(
//     comment => comment.article_id === articleId
//   );

//   return expectedComments.map(comment => {
//     const commentUser = users.find(user => user.id === comment.user_id);
//     return {
//       id: comment.id,
//       text: comment.text,
//       date_created: comment.date_created.toISOString(),
//       user: {
//         id: commentUser.id,
//         user_name: commentUser.user_name,
//         full_name: commentUser.full_name,
//         nickname: commentUser.nickname,
//         date_created: commentUser.date_created.toISOString(),
//         date_modified: commentUser.date_modified || null
//       }
//     };
//   });
// }

function makeMaliciousUser(user) {
  const maliciousUser = {
    id: 911,
    user_email: 'house@gmail.com',
    password: 'beach',
    image: 'Naughty naughty very naughty <script>alert("xss");</script>',
    facebook: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
    twitter: 'https://twitter.com/beaccchhoussse?lang=en',
    instagram: 'https://www.instagram.com/beaccchhoussse/?hl=en',
    youtube: 'https://www.youtube.com/channel/UCN-jxm11fOETNF5JrZsATCg',
    soundcloud: 'https://soundcloud.com/beachhouse',
    bandcamp: 'https://beachhouse.bandcamp.com/',
    contact_email: 'beach@gmail.com',
    created: new Date()
  };
  const expectedUser = {
    ...makeExpectedUser([user], maliciousUser),
    image:
      'Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;',
    facebook: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`
  };
  return {
    maliciousUser,
    expectedUser
  };
}

function makeUsersFixtures() {
  const testUsers = makeUsersArray();
  // const testShows = makeShowsArray(testUsers);
  // const testComments = makeCommentsArray(testUsers, testArticles);
  return { testUsers /*testShows testComments*/ };
}

function makeMaliciousShow(user) {
  const maliciousShow = {
    user_id: user.id,
    id: 911,
    date: '2022-04-12',
    city: 'Naughty naughty very naughty <script>alert("xss");</script>',
    venue: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
    created: new Date()
  };
  const expectedShow = {
    ...makeExpectedShow([user], maliciousShow),
    city:
      'Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;',
    venue: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`
  };
  return {
    maliciousShow,
    expectedShow
  };
}

function makeShowsFixtures() {
  const testUsers = makeUsersArray();
  const testShows = makeShowsArray(testUsers);
  // const testComments = makeCommentsArray(testUsers, testArticles);
  return { testUsers, testShows /*testComments*/ };
}

function makeMaliciousVideo(user) {
  const maliciousVideo = {
    user_id: user.id,
    id: 911,
    video: 'Naughty naughty very naughty <script>alert("xss");</script>',
    created: new Date()
  };
  const expectedVideo = {
    ...makeExpectedVideo([user], maliciousVideo),
    video:
      'Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;'
  };
  return {
    maliciousVideo,
    expectedVideo
  };
}

function makeVideosFixtures() {
  const testUsers = makeUsersArray();
  const testShows = makeVideosArray(testUsers);
  // const testComments = makeCommentsArray(testUsers, testArticles);
  return { testUsers, testShows /*testComments*/ };
}

function makeMaliciousSong(user) {
  const maliciousSong = {
    user_id: user.id,
    id: 911,
    song: 'Naughty naughty very naughty <script>alert("xss");</script>',
    created: new Date()
  };
  const expectedSong = {
    ...makeExpectedSong([user], maliciousSong),
    song:
      'Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;'
  };
  return {
    maliciousSong,
    expectedSong
  };
}

function makeSongsFixtures() {
  const testUsers = makeUsersArray();
  const testSongs = makeSongsArray(testUsers);
  // const testComments = makeCommentsArray(testUsers, testArticles);
  return { testUsers, testSongs /*testComments*/ };
}

function makeMaliciousEmail(user) {
  const maliciousEmail = {
    user_id: user.id,
    id: 911,
    email: 'Naughty naughty very naughty <script>alert("xss");</script>',
    created: new Date()
  };
  const expectedEmail = {
    ...makeExpectedEmail([user], maliciousEmail),
    email:
      'Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;'
  };
  return {
    maliciousEmail,
    expectedEmail
  };
}

function makeEmailsFixtures() {
  const testUsers = makeUsersArray();
  const testEmails = makeEmailsArray(testUsers);
  // const testComments = makeCommentsArray(testUsers, testArticles);
  return { testUsers, testEmails /*testComments*/ };
}

function cleanTables(db) {
  return db.transaction(trx =>
    trx
      .raw(
        `TRUNCATE
        shows,
        videos,
        songs,
        emails,
        users
      `
      )
      .then(() =>
        Promise.all([
          trx.raw(`ALTER SEQUENCE users_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE shows_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE videos_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE songs_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE emails_id_seq minvalue 0 START WITH 1`),
          trx.raw(`SELECT setval('users_id_seq', 0)`),
          trx.raw(`SELECT setval('shows_id_seq', 0)`),
          trx.raw(`SELECT setval('videos_id_seq', 0)`),
          trx.raw(`SELECT setval('songs_id_seq', 0)`),
          trx.raw(`SELECT setval('emails_id_seq', 0)`)
        ])
      )
  );
}

function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }));
  return db
    .into('users')
    .insert(preppedUsers)
    .then(() =>
      // update the auto sequence to stay in sync
      db.raw(`SELECT setval('users_id_seq', ?)`, [users[users.length - 1].id])
    );
}

function seedShowsTables(db, users, shows) {
  // use a transaction to group the queries and auto rollback on any failure
  return db.transaction(async trx => {
    await seedUsers(trx, users);
    await trx.into('shows').insert(shows);
    // update the auto sequence to match the forced id values
    await trx.raw(`SELECT setval('shows_id_seq', ?)`, [
      shows[shows.length - 1].id
    ]);
    // only insert comments if there are some, also update the sequence counter
    // if (comments.length) {
    //   await trx.into('blogful_comments').insert(comments);
    //   await trx.raw(`SELECT setval('blogful_comments_id_seq', ?)`, [
    //     comments[comments.length - 1].id
    //   ]);
    // }
  });
}

function seedMaliciousShow(db, user, show) {
  return seedUsers(db, [user]).then(() => db.into('shows').insert([show]));
}

function seedVideosTables(db, users, videos) {
  // use a transaction to group the queries and auto rollback on any failure
  return db.transaction(async trx => {
    await seedUsers(trx, users);
    await trx.into('videos').insert(videos);
    // update the auto sequence to match the forced id values
    await trx.raw(`SELECT setval('videos_id_seq', ?)`, [
      videos[videos.length - 1].id
    ]);
    // only insert comments if there are some, also update the sequence counter
    // if (comments.length) {
    //   await trx.into('blogful_comments').insert(comments);
    //   await trx.raw(`SELECT setval('blogful_comments_id_seq', ?)`, [
    //     comments[comments.length - 1].id
    //   ]);
    // }
  });
}

function seedMaliciousVideo(db, user, video) {
  return seedUsers(db, [user]).then(() => db.into('videos').insert([video]));
}

function seedSongsTables(db, users, songs) {
  // use a transaction to group the queries and auto rollback on any failure
  return db.transaction(async trx => {
    await seedUsers(trx, users);
    await trx.into('songs').insert(songs);
    // update the auto sequence to match the forced id values
    await trx.raw(`SELECT setval('songs_id_seq', ?)`, [
      songs[songs.length - 1].id
    ]);
    // only insert comments if there are some, also update the sequence counter
    // if (comments.length) {
    //   await trx.into('blogful_comments').insert(comments);
    //   await trx.raw(`SELECT setval('blogful_comments_id_seq', ?)`, [
    //     comments[comments.length - 1].id
    //   ]);
    // }
  });
}

function seedMaliciousSong(db, user, song) {
  return seedUsers(db, [user]).then(() => db.into('songs').insert([song]));
}

function seedEmailsTables(db, users, emails) {
  // use a transaction to group the queries and auto rollback on any failure
  return db.transaction(async trx => {
    await seedUsers(trx, users);
    await trx.into('emails').insert(emails);
    // update the auto sequence to match the forced id values
    await trx.raw(`SELECT setval('emails_id_seq', ?)`, [
      emails[emails.length - 1].id
    ]);
    // only insert comments if there are some, also update the sequence counter
    // if (comments.length) {
    //   await trx.into('blogful_comments').insert(comments);
    //   await trx.raw(`SELECT setval('blogful_comments_id_seq', ?)`, [
    //     comments[comments.length - 1].id
    //   ]);
    // }
  });
}

function seedMaliciousEmail(db, user, email) {
  return seedUsers(db, [user]).then(() => db.into('emails').insert([email]));
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.user_name,
    algorithm: 'HS256'
  });
  return `Bearer ${token}`;
}

module.exports = {
  makeUsersArray,
  makeShowsArray,
  makeVideosArray,
  makeSongsArray,
  makeEmailsArray,

  makeExpectedShow,
  makeExpectedVideo,
  makeExpectedSong,
  makeExpectedEmail,

  makeMaliciousUser,
  makeMaliciousShow,
  makeMaliciousVideo,
  makeMaliciousSong,
  makeMaliciousEmail,

  makeUsersFixtures,
  makeShowsFixtures,
  makeVideosFixtures,
  makeSongsFixtures,
  makeEmailsFixtures,

  cleanTables,
  seedUsers,

  seedShowsTables,
  seedVideosTables,
  seedSongsTables,
  seedEmailsTables,

  seedMaliciousShow,
  seedMaliciousVideo,
  seedMaliciousSong,
  seedMaliciousEmail,

  makeAuthHeader
};
