# Add New User

**URL** : `/users`

**Method** : `POST`

**Auth required** : NO

**Data example**

```json
{
  "user_email": "beachhouse@example.com",
  "band_name": "Beach House",
  "password": "Test!2345"
}
```

## Success Response

**Code** : `200 OK`

**Content example**

```json
{
  "id": 1,
  "user_email": "tj@thinkful.com",
  "password": "$2a$12$rfdyRWw5CqQqfk3.GoKJBe1tZUMjzNnyfpUyrH.Qb7j53MH7uFtqy",
  "image": "https://townsquare.media/site/295/files/2014/10/BonJovi.jpg",
  "facebook": "https://www.facebook.com/james",
  "twitter": "https://twitter.com/Ghost_Pavilion",
  "instagram": "https://instagram.com/Ghost_Pavilion",
  "youtube": "https://www.youtube.com/channel/UCTsBUcJQAQr4dMNkkDeywiw",
  "soundcloud": "https://soundcloud.com/destroyerband",
  "bandcamp": "https://destroyer.bandcamp.com/",
  "contact_email": "mailto:help@bswithjbj.com",
  "created": "2020-04-12T04:53:54.256Z",
  "band_name": "Bon Jovi",
  "band_slug": "bon-jovi"
}
```
