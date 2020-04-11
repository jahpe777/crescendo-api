# Crescendo API

https://powerful-basin-50906.herokuapp.com

The api for the Crescendo app was created with Node JS. It uses a database with tables for the users, shows, videos, songs, and emails. The api uses Express, Morgan, CORS and Knex. For testing I used supertest and mocha.

The server incorporates secure authentication and authorization practices.

## API Documentation

The Crescendo API is organized around REST. It accepts standard GET,POST, PATCH, and DELETE requests for users, shows, videos, songs, emails, and auth. The API returns JSON encoded responses.

All API calls begin with:
https://powerful-basin-50906.herokuapp.com/api

### Users

```
GET /users

PATCH /users

POST /users

GET /loggedin

GET /users/:id

DELETE /users/:id
```

### Shows

```
GET /shows

POST /shows

GET /shows/:show_id

DELETE /shows/:show_id
```

### Videos

GET /videos

POST /videos

GET /videos/video_id

DELETE /videos/:video_id

### Songs

GET /songs

POST /songs

GET /songs/:song_id

DELETE /songs/:song_id

### Emails

GET /songs

POST /songs

GET /songs/:email_id

DELETE /songs/:email_id

### Auth

POST /login

POST /refresh
