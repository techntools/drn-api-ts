# drn-api-ts

This is the Disc Rescue Network API. [Click here to view the API spec.]()

## Local Development

Install with `yarn`

Run with `yarn start`

## Packaging for Deployment

Run `docker build -t drn-api .`

For deploying to ECR view push commands in the AWS console, then use ECS to deploy the `drn-api` ECS task.

## Environment Variables

This app will throw an error and notify you of missing environment variables. The current required are:

- `APP_PORT` = API port to serve on
- `APP_CORS` = This API CORS, can be a comma separated list
- `DB_HOST` = Database host to connect to
- `DB_USER` = Database user to use
- `DB_PASSWORD` = Database user password
- `DB_NAME` = The database name to query on
- `AUTH_ISSUER` = issuer of auth bearer tokens
- `AUTH_AUDIENCE` = AUD for auth bearer token validation
- `TWILIO_SID` = Twilio SID from account details in login
- `TWILIO_AUTH_TOKEN` = Twilio Auth Token from account details in login
- `TWILIO_SEND_FROM` = the Twilio number to send messages from
- `TWILIO_WEBHOOK_URL` = the Twilio webhook url where new messages get POSTed to on this API
- `TWILIO_VCF_URL` = where the VCard is served from

## Code Architecture

### [/src](/src)

`app.ts` is the main entry point for starting the app routing where middleware and endpoints are established.

`middleware.ts` has additional custom middleware functions, i.e. validating org_code in auth bearer token.

`api.json` is the OpenAPI spec that enforces requests and responses, returning a specific error message on what is wrong with the request to the requesting client, or the server depending on which violates the response format.

### [/src/services](/src/services)

Services is where the app routes requests to be handled. Within services is subdirectores for domains, and each domain can have subdomains.

This includes:

- #### [inventory](/src/services/inventory)

  Found disc inventory

- #### [sms](/src/services/sms)

  Opt in/out and twilio messaging functions

- #### [discs](/src/services/discs)

  Disc golf disc mold types

- #### [brands](/src/services/brands)

  Disc golf disc brands

- #### [courses](/src/services/courses)

  Disc golf courses related to inventory in the system

- #### [ai](/src/services/ai)

  Google Vision for text detection with confidence scores

  _note: this relies on a google credentials.json being in the `/vision` subdirectory_

### [/src/db](/src/db)

This is the database directory where all database operations live. Uses a MySQL query generation library [zzzql](https://www.npmjs.com/package/zzzql).
