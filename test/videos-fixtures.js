function makeVideosArray() {
  return [
    {
      user_id: 1,
      id: 1,
      video: 'https://www.youtube.com/watch?v=NebExfqy5sI',
      created: new Date('2019-01-09T00:25:17.235Z')
    }
  ];
}

function makeMaliciousVideo() {
  const maliciousVideo = {
    user_id: 1,
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
