# Get All Songs

**URL** : `/songs`

**Method** : `GET`

**Auth required** : YES

## Success Response

**Code** : `200 OK`

**Content example**

```json
[
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
]
```
