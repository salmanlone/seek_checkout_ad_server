[![Build Status](https://travis-ci.org/salmanlone/seek_checkout_ad_server.svg?branch=master)](https://travis-ci.org/salmanlone/seek_checkout_ad_server)

# seek_checkout_ad_server
Seek assignment (server)

Make sure NPM or Yarn is installed on your machine before running anything

## Install require packages

```shell
yarn
```

```shell
npm install
```

## Available Scripts

In the project directory, you can run:

The project assumes that you are trying to run it in *nix operating system.

```shell
yarn start-local-server
```

Or if you use NPM you can:

```shell
npm run start-local-server
```

The project contains Travis build as well has Heroku Deployment
Details could be found in

```shell
.travis.yml
```

AND

```shell
Procfile
```

# Please make sure that you run the server before the client
It would require port 9000 from your end, as well as it will come seeded with the assignment data

# Explore Swagger
http://baseurl/docs/index.html

In my case the baseurl was `localhost:9000`

# User Details
Following are the user details to access server api endpoints which requires administration access

### Administraion acces:
```shell
username: admin
password: admin
```