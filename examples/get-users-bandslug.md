# Get Band Slug

**URL** : `/details/:bandSlug`

**Method** : `GET`

**Auth required** : NO

## Success Response

**Code** : `200 OK`

**Content example**

```json
{
  "id": 3,
  "user_email": "testing2@gmail.com",
  "password": "$2a$12$VaUIi.72Ai3fv3fs1oRuHuMbOe4n.0IyX/cz./OmvGB2t/1d.UcPq",
  "image": "https://d36g5zibv7pj3i.cloudfront.net/2016/01/14132008/unspecified5.jpg",
  "facebook": "https://www.facebook.com/beachhouse/",
  "twitter": "https://twitter.com/beaccchhoussse?lang=en",
  "instagram": "https://www.instagram.com/beaccchhoussse/?hl=en",
  "youtube": "https://www.youtube.com/channel/UCN-jxm11fOETNF5JrZsATCg",
  "soundcloud": "https://soundcloud.com/beachhouse",
  "bandcamp": "https://beachhouse.bandcamp.com/",
  "contact_email": "mailto:beachhouse@gmail.com",
  "created": "2020-04-14T23:53:53.590Z",
  "band_name": "Beach House",
  "band_slug": "beach-house",
  "videos": [
    {
      "user_id": 3,
      "id": 4,
      "video": "https://www.youtube.com/embed/OS6duOoxctw",
      "created": "2020-04-14T23:56:16.023Z"
    },
    {
      "user_id": 3,
      "id": 5,
      "video": "https://www.youtube.com/embed/j5Tt8bmeCBA",
      "created": "2020-04-14T23:56:37.817Z"
    }
  ],
  "songs": [
    {
      "user_id": 3,
      "id": 4,
      "song": "https://bandcamp.com/EmbeddedPlayer/album=1030921102/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/transparent=true/",
      "created": "2020-04-14T23:57:35.332Z"
    },
    {
      "user_id": 3,
      "id": 5,
      "song": "https://bandcamp.com/EmbeddedPlayer/album=2806323487/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/transparent=true/",
      "created": "2020-04-14T23:59:24.564Z"
    }
  ],
  "shows": [
    {
      "user_id": 3,
      "id": 4,
      "date": "04/23/2020",
      "city": "Los Angeles, CA",
      "venue": "The Fonda Theater",
      "created": "2020-04-14T23:59:48.604Z"
    },
    {
      "user_id": 3,
      "id": 5,
      "date": "05/22/2020",
      "city": "Oakland, CA",
      "venue": "The Fox Theater",
      "created": "2020-04-15T00:00:10.998Z"
    }
  ]
}
```
