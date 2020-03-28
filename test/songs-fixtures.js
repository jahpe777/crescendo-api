function makeSongsArray() {
  return [
    {
      user_id: 1,
      id: 1,
      song:
        'https://bandcamp.com/EmbeddedPlayer/album=1285841668/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/transparent=true/',
      created: new Date('2019-01-09T00:25:17.235Z')
    }
  ];
}

function makeMaliciousSong() {
  const maliciousSong = {
    user_id: 1,
    id: 4,
    song: 'Naughty naughty very naughty <script>alert("xss");</script>'
  };
  const expectedSong = {
    ...maliciousSong,
    song:
      'Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;'
  };
  return {
    maliciousSong,
    expectedSong
  };
}

module.exports = {
  makeSongsArray,
  makeMaliciousSong
};
