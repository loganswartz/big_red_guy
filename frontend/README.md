# Frontend

The frontend assets for BigRedGuy.

When the full application is built, this frontend is built and embedded directly
into the final binary.

## Development

You can start up the dev server for just the frontend with the standard `yarn
run start`. However, it's more convenient to run the entire application in dev
mode with `yarn run watch`. `yarn run watch` will run the frontend dev server,
as well as automatically compile and (re)start the backend on the fly using
`bacon`.
