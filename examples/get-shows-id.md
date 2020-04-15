# Get Specific Show

**URL** : `/shows/:show_id`

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
  "date": "04/23/2020",
  "city": "Los Angeles, CA",
  "venue": "The Fonda Theater",
  "created": "2020-04-14T23:59:48.604Z"
}
```
