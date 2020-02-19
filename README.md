# Crescendo API

https://fierce-hollows-84409.herokuapp.com/

The api for the Crescendo app was created with Node JS. It uses a database with tables for the shows and the subscribers. The api uses Express, Morgan, CORS and Knex. For testing I used supertest and mocha.

There is currently no authentication.

## API Documentation

The Crescendo API is organized around REST. It accepts standard GET, POST, and DELETE requests for shows and subscribers. The API returns JSON encoded responses.

All API calls begin with: https://fierce-hollows-84409.herokuapp.com/api/

### Users

GET /users GET /users/user_id POST /users DELETE /users/:user_id

### Shows

GET /shows GET /shows/:show_id POST /shows DELETE /shows/:show_id

### Videos

GET /videos GET /videos/video_id POST /videos DELETE /videos/:video_id

### Songs

GET /songs GET /songs/:song_id POST /songs DELETE /songs/:song_id
