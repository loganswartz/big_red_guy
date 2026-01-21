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
dependencies (other than a database and some configuration values).

The finished binary will be located at `target/release/big_red_guy`.

## Usage

All the necessary static files (the frontend, templates, etc) are embedded into
the binary when built for release, so running is as simple as `./big_red_guy`.
However, doing that without any prior configuration will result in a panic;
there's some necessary configuration that needs to happen first.

## Configuration

BigRedGuy's configuration system is built on top of Rocket's configuration
system, which is handled by Figment. This means that there are several ways to
modify our configuration, and there is support for configuring the app on a
per-release-profile (`debug`, `release`, etc...) basis. Read up on Figment's
docs to learn more.

The first method for configuration is a config file named at `config.toml`
by default (located in the same folder as the binary, or a parent / grandparent
/ etc directory to the binary). This is a renamed `Rocket.toml` with our own
options mixed in, so any options you can put in a `Rocket.toml` can be put in
`config.toml` verbatim. If you want to put your config file elsewhere, you can
use the `BRG_CONFIG` environment variable to specify an alternate config
location.

The second method for configuration is environment variables, in the form
`BRG_...`. All `ROCKET_...` environment variables have been renamed to use this
format, so for example, `ROCKET_PROFILE` is now `BRG_PROFILE`. Environment
variables don't have a release profile scope, or rather, they're always assumed
to be `global` (they unconditionally override any other values found from other
sources). In other words, the environment variable `BRG_PORT=3000` would be
equivalent to this config value:

```toml
[default]
port = 3000
```

Or, a more complicated example of `BRG_EMAIL='{smtp_host="smtp.example.com"}'`:

```toml
[default.email]
smtp_host = "smtp.example.com"
```

Just a note, when using the config file, prefer the `default` profile over
`global`, since using `default` and `global` are the same except for the fact
that `default` is overridable by other profiles, whereas `global` itself
overrides all other profiles.

### Required values

The only strictly required variable is `BRG_SECRET_KEY`. Generate a key with
`openssl rand -base64 32`, and pass the key in like so:

```bash
BRG_SECRET_KEY='<your private key>' /path/to/big_red_guy_binary
```

...or equivalently, create a `config.toml` and populate it with:

```toml
[default]
secret_key = "<your secret key>"
```

The path to the database file can be customized via the `databases` config
value (defaults to `./big_red_guy.sqlite`):

```toml
[default.databases.main]
url = "sqlite:///path/to/db.sqlite?mode=rwc"
```

Or as an environment variable:

```bash
BRG_DATABASES='{main={url="sqlite:///path/to/db.sqlite?mode=rwc"}}'
```

Check `config.toml.template` for a full-ish list of available options. Not all
of the `Rocket.toml` options are documented there, look those up in the Rocket
documentation if you need to modify those.

## Development

To set up a dev environment:

```bash
git clone git@github.com:loganswartz/big_red_guy.git && cd big_red_guy/backend

# for live-reloading the backend. Not required, but without it you have to
# restart your `yarn run watch` command every time you change the backend
cargo install --locked bacon

cd ../frontend && yarn install

yarn run watch
```

`yarn run watch` will run `cargo run` and `yarn run start` in parallel. The
yarn dev server is set up with the `proxy` arg, so it will a) serve all the
frontend files, and b) automatically forward any API requests to the backend
without any manual intervention. This means that when developing, you need to
run the frontend dev server with `yarn run watch` and connect to that,
rather than the backend.

When using a production build, this process is reversed: the backend will a)
handle all API requests sent to it, and b) serve all the compiled frontend
assets when an unrecognized route is requested.

### Developing with Nix

On Nix environments, certain Rust libraries don't like to build easily. Run
`nix-shell` in the root of the repo to start a dev shell that has all the
necessary packages in it for development and compilation.

## Motivation

I started this as a pet project to learn Rust, so there will be a lot of
improvements to be made.

## Misc

The favicon was generated from an icon from [Twemoji](https://twemoji.twitter.com/).
