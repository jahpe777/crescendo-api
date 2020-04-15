# Get Specific Video

**URL** : `/videos/video_id`

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
  "video": "https://www.youtube.com/embed/OS6duOoxctw",
  "created": "2020-04-14T23:56:16.023Z"
}
```
