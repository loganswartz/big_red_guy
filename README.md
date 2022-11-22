# big_red_guy

A "Secret Santa" manager written in Rust.

# About

`big_red_guy` is an app for sharing wishlists for any occasion and avoiding
double-buying. You can set up parties and add your friends and family, and then
everyone can add their lists and mark things off other lists.

# Building

You'll need a working Rust installation, and `npm`.

```bash
git clone git@github.com:loganswartz/big_red_guy.git && cd big_red_guy

cd backend && cargo install
cd ../frontend && npm install

cd ../backend/ && cargo build --release
```

The production build process should automatically start a production build of
the frontend, and then embed those frontend files into the compiled binary. This
means that a production build should be able to be run with absolutely no
external dependencies.

# Development

To set up a dev environment:

```bash
git clone git@github.com:loganswartz/big_red_guy.git && cd big_red_guy

cd backend && cargo install
cd ../frontend && npm install

npm run dev-start
```

`npm run dev-start` will run `cargo run` and `npm run start` in parallel. The
npm dev server is set up with the `proxy` arg, so it should automatically
forward any API requests to the backend without any further setup necessary.

This means that when developing, you need to run the frontend dev server with
`npm run dev-start` and connect directly to that. When using a production build,
the backend will serve all the production-ready frontend files.

# Motivation

I started this as a pet project to learn Rust, so there will be a lot of
improvements to be made.
