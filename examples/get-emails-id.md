# Get Specific Email

**URL** : `/emails/:email_id`

**Method** : `GET`

**Auth required** : YES

**Data example**

```json
{
  "id": 1
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
