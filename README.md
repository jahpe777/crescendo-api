# Crescendo API

https://powerful-basin-50906.herokuapp.com

The api for the Crescendo app was created with Node JS. It uses a database with tables for the users, shows, videos, songs, and emails. The api uses Express, Morgan, CORS and Knex. For testing I used supertest and mocha.

The server incorporates secure authentication and authorization practices.

## API Documentation

The Crescendo API is organized around REST. It accepts standard GET, POST, PATCH, and DELETE requests for users, shows, videos, songs, emails, and auth. The API returns JSON encoded responses.

All API calls begin with:
https://powerful-basin-50906.herokuapp.com/api

### Users

[Get All Users](https://github.com/jahpe777/crescendo-api/blob/master/examples/get-users.md)

[Update User](https://github.com/jahpe777/crescendo-api/blob/master/examples/patch-users.md)

[Add New User](https://github.com/jahpe777/crescendo-api/blob/master/examples/post-users.md)

[Logged In](https://github.com/jahpe777/crescendo-api/blob/master/examples/get-loggedin.md)

[Get Band Slug](https://github.com/jahpe777/crescendo-api/blob/master/examples/get-users-bandslug.md)

[Get Specific User](https://github.com/jahpe777/crescendo-api/blob/master/examples/get-users-id.md)

[Delete Specific User](https://github.com/jahpe777/crescendo-api/blob/master/examples/delete-users-id.md)

### Shows

[Get All Shows](https://github.com/jahpe777/crescendo-api/blob/master/examples/get-shows.md)

[Add New Show](https://github.com/jahpe777/crescendo-api/blob/master/examples/post-shows.md)

[Get Specific Show](https://github.com/jahpe777/crescendo-api/blob/master/examples/get-shows-id.md)

[Delete Specific Show](https://github.com/jahpe777/crescendo-api/blob/master/examples/delete-shows-id.md)

### Videos

[Get All Videos](https://github.com/jahpe777/crescendo-api/blob/master/examples/get-videos.md)

[Add New Video](https://github.com/jahpe777/crescendo-api/blob/master/examples/post-videos.md)

[Get Specific Video](https://github.com/jahpe777/crescendo-api/blob/master/examples/get-videos-id.md)

[Delete Specific Video](https://github.com/jahpe777/crescendo-api/blob/master/examples/delete-videos-id.md)

### Songs

[Get All Songs](https://github.com/jahpe777/crescendo-api/blob/master/examples/get-songs.md)

[Add New Song](https://github.com/jahpe777/crescendo-api/blob/master/examples/post-songs.md)

[Get Specific Song](https://github.com/jahpe777/crescendo-api/blob/master/examples/get-songs-id.md)

[Delete Specific Song](https://github.com/jahpe777/crescendo-api/blob/master/examples/delete-songs-id.md)

### Emails

[Get All Emails](https://github.com/jahpe777/crescendo-api/blob/master/examples/get-emails.md)

[Add New Email](https://github.com/jahpe777/crescendo-api/blob/master/examples/post-emails.md)

[Get Specific Email](https://github.com/jahpe777/crescendo-api/blob/master/examples/get-emails-id.md)

[Delete Specific Email](https://github.com/jahpe777/crescendo-api/blob/master/examples/delete-emails-id.md)

### Auth

[Login With Auth](https://github.com/jahpe777/crescendo-api/blob/master/examples/post-auth-login.md)

[Refresh Auth](https://github.com/jahpe777/crescendo-api/blob/master/examples/post-auth-refresh.md)
