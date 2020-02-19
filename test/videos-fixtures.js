function makeVideosArray() {
  return [
    {
      user_id: 1,
      id: 1,
      video: 'https://www.youtube.com/watch?v=NebExfqy5sI',
      created: '2019-01-09T00:25:17.235Z'
    },
    {
      user_id: 2,
      id: 2,
      video: 'https://www.youtube.com/watch?v=9mFTgJQtCPk',
      created: '2018-01-09T00:25:17.235Z'
    },
    {
      user_id: 3,
      id: 3,
      video: 'https://www.youtube.com/watch?v=vkLOg252KRE',
      created: '2017-01-09T00:25:17.235Z'
    }
  ];
}

function makeMaliciousVideo() {
  const maliciousVideo = {
    id: 4,
    video: 'Naughty naughty very naughty <script>alert("xss");</script>'
  };
  const expectedVideo = {
    ...maliciousVideo,
    video:
      'Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;'
  };
  return {
    maliciousVideo,
    expectedVideo
  };
}

module.exports = {
  makeVideosArray,
  makeMaliciousVideo
};
