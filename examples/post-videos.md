# Add New Video

**URL** : `/videos`

**Method** : `POST`

**Auth required** : YES

**Data example**

```json
{
  "video": "https://www.youtube.com/embed/OS6duOoxctw"
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
