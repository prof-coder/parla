# Task Runner
Front-end tool for task automation.

# TLDR

- `yarn html` - This process is used only when you don't need to upload the files to Shopify server and you work only on HTML files locally.
- `yarn configure` - works the same as themekit configure, but adds new extra parameter because the config file right now will be created at the root directory of the project
- `yarn download` - This can be used if there is some conflict of edited files from the Shopify Theme editor.
- `yarn open` - Open the theme in preview mode. Works with environments.
- `yarn watch` - Dev watch process.
- `yarn deploy` - Remove all theme files and deploy the working version files.
- `yarn deploy-prod` - Remove all theme files and upload fresh new optimized files.

Also, all commands work with environments parameter, `--env="production` etc.

## Tips
Use bash terminal (default terminal on OSX and Linux, [GitBash](http://git-scm.com/downloads) on Windows).

## Dependencies
1. Latest version of [NodeJS](http://nodejs.org/) (min v6.0.0)
2. Latest version of any of the following package managers

- [NPM](https://www.npmjs.com/) (min v5.3.0)
- [Yarn](https://yarnpkg.com/) (min v0.20.4)

3. Latest version of [Shopify Theme Kit](https://shopify.github.io/themekit/)

## Install
In the root directory of the project run:

```
npm install
```

or

```
yarn
```

If for some reason, NPM/Yarn throws errors and does not want to install the dependencies, please see https://goo.gl/iSz4w8.

TL;DR

Run

```
npm cache clean
```

If that does not fix the issue, manually remove everything in the `~/AppData/Roaming/npm-cache` folder.

MAC/Linux users should try and find another way to delete this folder's contents because they do not have access to this folder by default.

Then run the install script again.

## MAC OSX Setup

If you are using OSX, you need to run the following (only once):

1. `brew update`
2. `brew install libtool automake autoconf nasm`
3. `brew reinstall libpng`

## Linux setup

If you are using linux environment, you need to run the following (only once):

1. `sudo apt-get install libtool automake autoconf nasm`

## Development

After installing your theme in the `shopify` folder, follow the steps below:

First run the following command which will clean the `assets` folder in the Shopify theme:

```
npm run clean
```

or

```
yarn run clean
```

If you want to work only on the front-end part, run:

```
npm run html
```

or

```
yarn run html
```

If you want to work on the back-end part too, run:

```
npm start
```

or

```
yarn start
```

If you want to work on different enviroment, run:

```
npm run start -- --env="production"
```

or

```
yarn run start --env="production"
```

## Build
To build the project, run:

```
npm run deploy
```

or

```
yarn run deploy

```


If you want to work on different enviroment, run:

```
npm run deploy -- --env="production"
```

or

```
yarn run deploy --env="production"
```

## Production
To build the project for production environment (e.g. minimize bundles css and js files and optimize images), run:

```
npm run deploy-prod
```

or

```
yarn run deploy-prod
```

If you want to work on different enviroment, run:

```
npm run deploy-prod -- --env="production"
```

or

```
yarn run deploy-prod --env="production"
```


## Setup enviroment
To setup Shopify enviroment, run:


```
npm run configure -- -s="STORE.myshopify.com" -p="PASSWORD" -t="THEMEID" -e="PRODUCTION"
```

or

```
yarn run configure -s STORE.myshopify.com -p PASSWORD -t THEMEID -e PRODUCTION
```

If you want to work on different enviroment, run:

```
npm run deploy-prod -- --env="production"
```

or

```
yarn run deploy-prod --env="production"
```

# Markup

## Favicon

The files `favicon.ico` or `favicon.png` should be stored into `assets/vendor` folder.

*If these files are stored in `assets/images` won't be transfered to Shopify, because they are not used in the `.css` files.
