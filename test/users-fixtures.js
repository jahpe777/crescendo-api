function makeUsersArray() {
  return [
    {
      id: 1,
      user_email: 'steely@gmail.com',
      image:
        'https://www.rollingstone.com/wp-content/uploads/2018/06/steely-dan-essential-songs-2017-listen-23e00365-05ec-4359-ab0a-f89c092213bc.jpg',
      created: '2019-01-09T00:25:17.235Z'
    },
    {
      id: 2,
      user_email: 'drug@gmail.com',
      image:
        'https://i1.wp.com/buzzbands.s3.amazonaws.com/wp-content/uploads/2014/12/Drug-Cabin.jpg',
      created: '2018-01-09T00:25:17.235Z'
    },
    {
      id: 3,
      user_email: 'the@gmail.com',
      image:
        'https://consequenceofsound.net/wp-content/uploads/2020/02/The-Strokes.jpg?quality=80&w=807',
      created: '2017-01-09T00:25:17.235Z'
    }
  ];
}

function makeMaliciousUser() {
  const maliciousUser = {
    id: 4,
    user_email: 'Naughty naughty very naughty <script>alert("xss");</script>'
  };
  const expectedUser = {
    ...maliciousUser,
    user_email:
      'Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;'
  };
  return {
    maliciousUser,
    expectedUser
  };
}

module.exports = {
  makeUsersArray,
  makeMaliciousUser
};
