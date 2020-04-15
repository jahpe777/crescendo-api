# Add New Email

**URL** : `/emails`

**Method** : `POST`

**Auth required** : YES

**Data example**

```json
{
  "email": "tb@thinkful.com"
}
```

## Success Response

**Code** : `200 OK`

**Content example**

```json
{
  "user_id": 3,
  "id": 1,
  "email": "tb@thinkful.com",
  "created": "2020-04-15T02:57:59.849Z"
}
```
