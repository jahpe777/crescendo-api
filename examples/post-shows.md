# Add New Show

**URL** : `/shows`

**Method** : `POST`

**Auth required** : YES

**Data example**

```json
{
  "date": "04/23/2020",
  "city": "Los Angeles, CA",
  "venue": "The Fonda Theater"
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
