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
      created: '2021-01-09T00:25:17.235Z'
    }
  ];
}

function makeShowsArray(users) {
  return [
    {
      user_id: 1,
      id: 1,
      date: '05/13/2021',
      city: 'Orlando, FL',
      venue: 'Boo',
      created: '2021-01-09T00:25:17.235Z'
    }
  ];
}

function makeVideosArray(users) {
  return [
    {
      user_id: 1,
      id: 1,
      video: 'https://www.youtube.com/embed/OS6duOoxctw',
      created: '2021-01-09T00:25:17.235Z'
    }
  ];
}

function makeSongsArray(users) {
  return [
    {
      user_id: 1,
      id: 1,
      song:
        'https://bandcamp.com/EmbeddedPlayer/album=1030921102/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/transparent=true/',
      created: '2021-01-09T00:25:17.235Z'
    }
  ];
}

function makeEmailsArray(users) {
  return [
    {
      user_id: 1,
      id: 1,
      email: 'house@gmail.com',
      created: '2021-01-09T00:25:17.235Z'
    }
  ];
}

function makeExpectedUser(user, maliciousUser) {
  return {
    id: maliciousUser.id,
    user_email: maliciousUser.user_email,
    password: maliciousUser.password,
    image: user.image,
    facebook: user.facebook,
    twitter: user.twitter,
    instagram: user.instagram,
    youtube: user.youtube,
    soundcloud: user.soundcloud,
    bandcamp: user.bandcamp,
    contact_email: user.contact_email,
    created: user.created /*.toISOString()*/
  };
}

function makeExpectedShow(users, show) {
  const showUser = users.find(user => user.id === show.user_id);

  return {
    user_id: show.user_id,
    id: show.id,
    date: show.date,
    city: show.city,
    venue: show.venue,
    created: show.created /*.toISOString()*/,
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
      created: showUser.created /*.toISOString()*/,
      modified: showUser.modified || null
    }
  };
}

function makeExpectedVideo(users, video) {
  const videoUser = users.find(user => user.id === video.user_id);

  return {
    user_id: video.user_id,
    id: video.id,
    video: video.video,
    created: video.created /*.toISOString()*/,
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
      created: videoUser.created /*.toISOString()*/,
      modified: videoUser.modified || null
    }
  };
}

function makeExpectedSong(users, song) {
  const songUser = users.find(user => user.id === song.user_id);

  return {
    user_id: song.user_id,
    id: song.id,
    song: song.song,
    created: song.created /*.toISOString()*/,
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
      created: songUser.created /*.toISOString()*/,
      modified: songUser.modified || null
    }
  };
}

function makeExpectedEmail(users, email) {
  const emailUser = users.find(user => user.id === email.user_id);

  return {
    user_id: email.user_id,
    id: email.id,
    email: email.email,
    created: email.created /*.toISOString()*/,
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
      created: emailUser.created /*.toISOString()*/,
      modified: emailUser.modified || null
    }
  };
}

function makeMaliciousUser(user) {
  const maliciousUser = {
    id: 911,
    user_email: 'house@gmail.com',
    password: 'B3@ch!234',
    image: 'Naughty naughty very naughty <script>alert("xss");</script>',
    facebook: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
    twitter: 'https://twitter.com/beaccchhoussse?lang=en',
    instagram: 'https://www.instagram.com/beaccchhoussse/?hl=en',
    youtube: 'https://www.youtube.com/channel/UCN-jxm11fOETNF5JrZsATCg',
    soundcloud: 'https://soundcloud.com/beachhouse',
    bandcamp: 'https://beachhouse.bandcamp.com/',
    contact_email: 'beach@gmail.com',
    created: new Date('2021-01-09T00:25:17.235Z')
  };
  const expectedUser = {
    ...makeExpectedUser(user, maliciousUser),
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
  const testShows = makeShowsArray(testUsers);
  const testVideos = makeVideosArray(testUsers);
  const testSongs = makeSongsArray(testUsers);
  const testEmails = makeEmailsArray(testUsers);
  return { testUsers, testShows, testVideos, testSongs, testEmails };
}

function makeMaliciousShow(user) {
  const maliciousShow = {
    user_id: user.id,
    id: 911,
    date: '04/12/2022',
    city: 'Naughty naughty very naughty <script>alert("xss");</script>',
    venue: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
    created: '2029-01-22T16:28:32.615Z'
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
  return { testUsers, testShows };
}

function makeMaliciousVideo(user) {
  const maliciousVideo = {
    user_id: user.id,
    id: 911,
    video: 'Naughty naughty very naughty <script>alert("xss");</script>',
    created: '2029-01-22T16:28:32.615Z'
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
  const testVideos = makeVideosArray(testUsers);
  return { testUsers, testVideos };
}

function makeMaliciousSong(user) {
  const maliciousSong = {
    user_id: user.id,
    id: 911,
    song: 'Naughty naughty very naughty <script>alert("xss");</script>',
    created: '2029-01-22T16:28:32.615Z'
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
  return { testUsers, testSongs };
}

function makeMaliciousEmail(user) {
  const maliciousEmail = {
    user_id: user.id,
    id: 911,
    email: 'Naughty naughty very naughty <script>alert("xss");</script>',
    created: '2027-01-22T16:28:32.615Z'
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
  return { testUsers, testEmails };
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
  });
}

function seedVideosTables(db, users, videos) {
  return db.transaction(async trx => {
    await seedUsers(trx, users);
    await trx.into('videos').insert(videos);
    await trx.raw(`SELECT setval('videos_id_seq', ?)`, [
      videos[videos.length - 1].id
    ]);
  });
}

function seedSongsTables(db, users, songs) {
  return db.transaction(async trx => {
    await seedUsers(trx, users);
    await trx.into('songs').insert(songs);
    await trx.raw(`SELECT setval('songs_id_seq', ?)`, [
      songs[songs.length - 1].id
    ]);
  });
}

function seedEmailsTables(db, users, emails) {
  return db.transaction(async trx => {
    await seedUsers(trx, users);
    await trx.into('emails').insert(emails);
    await trx.raw(`SELECT setval('emails_id_seq', ?)`, [
      emails[emails.length - 1].id
    ]);
  });
}

function seedMaliciousUser(db, user) {
  return seedUsers(db).then(() => db.into('users').insert([user]));
}

function seedMaliciousShow(db, user, show) {
  return seedUsers(db, [user]).then(() => db.into('shows').insert([show]));
}

function seedMaliciousVideo(db, user, video) {
  return seedUsers(db, [user]).then(() => db.into('videos').insert([video]));
}

function seedMaliciousSong(db, user, song) {
  return seedUsers(db, [user]).then(() => db.into('songs').insert([song]));
}

function seedMaliciousEmail(db, user, email) {
  return seedUsers(db, [user]).then(() => db.into('emails').insert([email]));
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.user_email,
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

  makeExpectedUser,
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

  seedMaliciousUser,
  seedMaliciousShow,
  seedMaliciousVideo,
  seedMaliciousSong,
  seedMaliciousEmail,

  makeAuthHeader
};
