# big_red_guy

A "Secret Santa" manager written in Rust.

## About

`big_red_guy` is an app for sharing wishlists for any occasion and avoiding
double-buying. You can set up parties and add your friends and family, and then
everyone can add their lists and mark things off other lists.

## Building

You'll need a working Rust installation, and `yarn`.

```bash
git clone git@github.com:loganswartz/big_red_guy.git && cd big_red_guy/backend

cargo build --release
```

The production build process should automatically run a production build of the
frontend, and then embed those frontend files into the compiled binary. This
means that a production build should be able to be run without any external
dependencies (other than a database).

The finished binary will be located at `target/release/big_red_guy`.

## Usage

To run a production binary, you need to specify some environment variables:

The only required variable is `ROCKET_SECRET_KEY`. Generate a key with `openssl
rand -base64 32`, and pass the key in:

```bash
ROCKET_SECRET_KEY='<your private key>' /path/to/big_red_guy_binary
```

The path to the database file can be customized via the `ROCKET_DATABASES` env
variable (defaults to `./big_red_guy.sqlite`).

```bash
ROCKET_DATABASES='{main={url="sqlite:///path/to/db.sqlite?mode=rwc"}}'
```

## Development

To set up a dev environment:

```bash
git clone git@github.com:loganswartz/big_red_guy.git && cd big_red_guy/backend

# for live-reloading the backend. Not required, but without it you have to
# restart your `yarn run dev-start` command every time you change the backend
cargo install cargo-watch

cd ../frontend && yarn install

yarn run dev-start
```

`yarn run dev-start` will run `cargo run` and `yarn run start` in parallel. The
yarn dev server is set up with the `proxy` arg, so it should automatically
forward any API requests to the backend without any further setup necessary.

This means that when developing, you need to run the frontend dev server with
`yarn run dev-start` and connect directly to that. When using a production
build, the backend will serve all the production-ready frontend files.

## Motivation

I started this as a pet project to learn Rust, so there will be a lot of
improvements to be made.

## Misc

The favicon was generated from an icon from [Twemoji](https://twemoji.twitter.com/).
