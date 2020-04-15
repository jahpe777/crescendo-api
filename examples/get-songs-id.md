# Get Specific Song

**URL** : `/songs/:song_id`

**Method** : `GET`

**Auth required** : YES

**Data example**

```json
{
  "id": 4
}
```

## Success Response

**Code** : `200 OK`

**Content example**

```json
{
  "user_id": 3,
  "id": 4,
  "song": "https://bandcamp.com/EmbeddedPlayer/album=1030921102/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/transparent=true/",
  "created": "2020-04-14T23:57:35.332Z"
}
```
