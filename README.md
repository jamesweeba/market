# KAYAYO

kayayo

# REST API KAYAYO application


The entry point for this application  within the `index.js` file.



## Run the app

    npm run start

## Run the tests

    not ready yet

# REST API

The REST API for KAYAYO APP.

## Register a user

### Request

`POST /auth/signups`

curl --location --request POST 'http://localhost:1900/api/v1/auth/signups' \

--header 'Content-Type: application/json' \
--data-raw '
{"first_name":"aseye","last_name":"aseye","email":"yellowmon@yahoo.com","contact":"+233545054678","password":"123456"}'

### Response

    HTTP/1.1 200 Created
    Date: Thu, 24 Feb 2011 12:36:30 GMT
    Status: 200 Created
    Connection: close
    Content-Type: application/json
    Content-Length: 2

  
  {
    "count": 1,
    "items": [
        {
            "id": "d2075d8f-fe57-41ca-9e7c-f0d53413230d",
            "first_name": "aseye",
            "last_name": "aseye",
            "contact": "233545054678",
            "email": "yellowmon@yahoo.com",
            "role": "manager",
            "posted_ts": "2021-06-06T17:00:53.219Z"
        }
    ],
    "jwtToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQyMDc1ZDhmLWZlNTctNDFjYS05ZTdjLWYwZDUzNDEzMjMwZCIsImZpcnN0X25hbWUiOiJhc2V5ZSIsImxhc3RfbmFtZSI6ImFzZXllIiwiY29udGFjdCI6IjIzMzU0NTA1NDY3OCIsImVtYWlsIjoieWVsbG93bW9uQHlhaG9vLmNvbSIsInJvbGUiOiJtYW5hZ2VyIiwicG9zdGVkX3RzIjoiMjAyMS0wNi0wNlQxNzowMDo1My4yMTlaIiwiaWF0IjoxNjIyOTk4ODUzLCJleHAiOjE2MjM2MDM2NTN9.y1SZKJbbq-IcfsOqG4vILnnQeExvuLoWNp4M3JD7oKY"
}

## User login

### Request

`POST /auth/logins/`

curl --location --request POST 'http://localhost:1900/api/v1/auth/logins/' \
--header 'Authorization: Basic eWVsbG93bW9uQHlhaG9vLmNvbToxMjM0NTY=' \
--data-raw ''

### Response

    HTTP/1.1 200 OK
    Date: Thu, 24 Feb 2011 12:36:30 GMT
    Status: 201 OK
    Connection: close
    Content-Type: application/json
    Location: /thing/1
    Content-Length: 36

{
    "first_name": "aseye",
    "last_name": "aseye",
    "contact": "233545054678",
    "email": "yellowmon@yahoo.com",
    "id": "6c76a3f6-f08c-497e-9f08-a02dc9b037be",
    "jwtToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXJzdF9uYW1lIjoiYXNleWUiLCJsYXN0X25hbWUiOiJhc2V5ZSIsImNvbnRhY3QiOiIyMzM1NDUwNTQ2NzgiLCJlbWFpbCI6InllbGxvd21vbkB5YWhvby5jb20iLCJpZCI6IjZjNzZhM2Y2LWYwOGMtNDk3ZS05ZjA4LWEwMmRjOWIwMzdiZSIsImlhdCI6MTYyMjk5OTE0MiwiZXhwIjoxNjIzNjAzOTQyfQ.8OavXVo33-jSGHKyWQL1m4GGuPwWh1LC_Xt8zXQKORA"
}

## Create an Agent

### Request

`POST /auth/signups`

curl --location --request POST 'http://localhost:1900/api/v1/auth/signups' \
--header 'Authorization: Basic Z25ockBlc29rby5jb206Z25ockBlc29rbw==' \
--header 'Content-Type: application/json' \
--data-raw '
{"first_name":"aseye","last_name":"aseye","email":"yellowmon@yahoo.com","contact":"+233545054678","password":"123456","role":"agent","market_id":2}'

### Response

 HTTP/1.1 200 OK
    Date: Thu, 24 Feb 2011 12:36:30 GMT
    Status: 201 OK
    Connection: close
    Content-Type: application/json
    Location: /thing/1

    {
    "count": 1,
    "items": [
        {
            "id": "3d5415c3-8267-4e69-84c6-94cee248adf4",
            "first_name": "aseye",
            "last_name": "aseye",
            "contact": "233545054678",
            "email": "yellowmon@yahoo.com",
            "role": "agent",
            "posted_ts": "2021-06-06T17:14:23.499Z"
        }
    ],
    "jwtToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjNkNTQxNWMzLTgyNjctNGU2OS04NGM2LTk0Y2VlMjQ4YWRmNCIsImZpcnN0X25hbWUiOiJhc2V5ZSIsImxhc3RfbmFtZSI6ImFzZXllIiwiY29udGFjdCI6IjIzMzU0NTA1NDY3OCIsImVtYWlsIjoieWVsbG93bW9uQHlhaG9vLmNvbSIsInJvbGUiOiJhZ2VudCIsInBvc3RlZF90cyI6IjIwMjEtMDYtMDZUMTc6MTQ6MjMuNDk5WiIsImlhdCI6MTYyMjk5OTY2MywiZXhwIjoxNjIzNjA0NDYzfQ.8KD_qOgOwId6fmGcaAEoIdDC0eTlZUW_BpYHz4tZaCQ"
}


## Create or make request

### Request

`POST /orders/`

curl --location --request POST 'http://localhost:1900/api/v1/orders' \
--header 'x-access-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXJzdF9uYW1lIjoiYXNleWUiLCJsYXN0X25hbWUiOiJhc2V5ZSIsImNvbnRhY3QiOiIyMzM1NDUwNTQ2NzgiLCJlbWFpbCI6InllbGxvd21vbkB5YWhvby5jb20iLCJpZCI6ImEwYzU2MjNjLTk5OTEtNGM1Zi1iZmI0LWQyNGNlZDllNWIzYSIsImlhdCI6MTYyMzAwMzgzMCwiZXhwIjoxNjIzNjA4NjMwfQ.TYdEPWX-DbHJLIctW5gRBrQUDRJuyk6rCIRby5jHGoc' \
--header 'Authorization: Basic Z25ockBlc29rby5jb206Z25ockBlc29rbw==' \
--header 'Content-Type: application/json' \
--data-raw '
 {
 "request" :  [{"name":"tomatoes","price":"2"},{"name":"tomatoes","price":"2"}],
 "status":"PENDING",
 "market":2
 }'

 ### Response
 {
    "id": "870a4922-0e55-407a-920b-d2a7dcb53579",
    "user_id": "a0c5623c-9991-4c5f-bfb4-d24ced9e5b3a",
    "request": [
        {
            "name": "tomatoes",
            "price": "2"
        },
        {
            "name": "tomatoes",
            "price": "2"
        }
    ],
    "posted_ts": "2021-06-06T19:07:38.902Z",
    "status": "PENDING",
    "market": "2",
    "agent_id": "e2e47d27-a1f1-4906-94da-e65f8b4a3d58"
}


