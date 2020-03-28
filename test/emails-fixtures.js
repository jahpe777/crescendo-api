function makeEmailsArray() {
  return [
    {
      id: 1,
      email: 'james@gmail.com',
      created: new Date('2019-01-09T00:25:17.235Z')
    }
  ];
}

function makeMaliciousEmail() {
  const maliciousEmail = {
    user_id: 1,
    id: 4,
    email: 'Naughty naughty very naughty <script>alert("xss");</script>'
  };
  const expectedEmail = {
    ...maliciousEmail,
    email:
      'Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;'
  };
  return {
    maliciousEmail,
    expectedEmail
  };
}

module.exports = {
  makeEmailsArray,
  makeMaliciousEmail
};
