function makeSongsArray() {
  return [
    {
      user_id: 1,
      id: 1,
      song:
        'https://bandcamp.com/EmbeddedPlayer/album=1285841668/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/transparent=true/',
      created: '2019-01-09T00:25:17.235Z'
    },
    {
      user_id: 2,
      id: 2,
      song:
        'https://bandcamp.com/EmbeddedPlayer/album=2428500762/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/transparent=true/',
      created: '2018-01-09T00:25:17.235Z'
    },
    {
      user_id: 3,
      id: 3,
      song:
        'https://bandcamp.com/EmbeddedPlayer/album=1126986416/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/transparent=true/',
      created: '2017-01-09T00:25:17.235Z'
    }
  ];
}

function makeMaliciousSong() {
  const maliciousSong = {
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
