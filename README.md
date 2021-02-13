# Expo SSR

Server Side Rendering with Expo, React Native Web and Serverless Koa.

A framework for a single monorepo, monolith javascript stack with a shared codebase for all clients - web, mobile applications, desktop applications, browser extensions, etc. 

Less Code, Better Performance, Quicker Development. In theory.

## [NOT FOR PRODUCTION] Currently in development. Dependencies, project structure, etc, may change.

## Expo Instructions

1. Clone the Repo
`$ git clone git@github.com:tyrauber/expo-ssr.git`

2. Install the dependencies
`$ yarn install`

3. Run expo
`$ expo start`

Expo Web and iOS Work.

## Server Instructions

1. Build the server
` $ serverless offline`

2. Deploy the server
`$ serverless deploy`

Serves the PWA.

## Stack

- [React](https://reactjs.org/) Javascript UI
- [ReactNativeWeb](https://necolas.github.io/react-native-web) React Native Components
- [ReactNavigation](https://reactnavigation.org/) React Routing
- [Expo](https://docs.expo.io/) Universal React Application Framework
- [Koa](https://koajs.com/) Web Framework
- [Serverless](https://www.serverless.com/) Deployment Framework

## Resources

- [ReactNavigation Getting started](https://reactnavigation.org/docs/getting-started)
- [ReactNavigation SSR Documentation](https://reactnavigation.org/docs/server-rendering)
- [ReactNavigation SSR Example ](https://github.com/jaredpalmer/razzle/tree/master/examples/with-react-native-web)

## Build Steps

Following the documentation, here: [Getting started](https://reactnavigation.org/docs/getting-started)

First, let's stub out a blank expo project.

`$ expo init expo-koa`

Install @react-navigation/native
`yarn add @react-navigation/native`

Install dependencies
`yarn add react-native-reanimated react-native-gesture-handler react-native-screens react-native-safe-area-context @react-native-community/masked-view`

Add @react-navigation/stack
`yarn add @react-navigation/stack`

Modify App.js with [Hello React Navigation](https://reactnavigation.org/docs/hello-react-navigation).

Run `expo start` and choose web. It renders. Cool. 

Let's move some files around.  Create a src directory, `mkdir src`, and move App.js there `mv App.js src/App.js`.

Create `src/AppEntry.js`

```
import 'react-native-gesture-handler';
import registerRootComponent from 'expo/build/launch/registerRootComponent';
import App from './App';
registerRootComponent(App);
```

And update package main to reference it.

```
 "main": "src/AppEntry.js",
```

Run `expo start` and choose web. It renders. Cool. Moving On.

Now, let's make that work in Serverless and Koa.

`yarn add koa serverless serverless-http`

And serverless-offline for local development.

`yarn add serverless-offline --dev`

Let's add a simple koa 'hello world' server with serverless-http support.

```
// src/index.js
import Koa from 'koa';
import serverless from 'serverless-http';

const app = new Koa();

import App from './App';

app.use(async (ctx) => {
  ctx.body = "Hello World"
})

const PORT = process.env.PORT || 3000;

if(!(process.env._HANDLER) && process.env.NODE_ENV !== 'test') {
  const { PORT = 80 } = process.env;
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}!`);
  });
}

exports.app = app;
exports.web = serverless(app);
```

One last thing we need is a serverless.yml configuration.

```
service: sls-expo

plugins:
    - serverless-offline

provider:
    name: aws
    runtime: nodejs8.10

functions:
  web:
    handler: src/index.web
    timeout: 30
    events:
      - http:
          path: /
          method: ANY
          cors: true
      - http:
          path: /{any+}
          method: ANY
          cors: true
```

At this point, we should be able to run the koa server with serverless offline.

`$ serverless offline`

If you pop open [http://localhost:3000/dev](http://localhost:3000/dev), you should see "Hello World".

Ok. Now, let's see if we can compile our React Native Web App with babel and webpack.

`yarn add serverless-webpack webpack webpack-node-externals babel-loader @babel/core @babel/preset-env babel-plugin-source-map-support --dev`

`yarn add source-map-support`

Update our serverless.yml to include:

```
plugins:
    - serverless-webpack
    - serverless-offline

custom:
    webpack:
        webpackConfig: ./webpack.serverless.js
        includeModules: true
```

And now we need a webpack config:

```
// webpack.serverless.js
const slsw = require("serverless-webpack");
const nodeExternals = require("webpack-node-externals");
const path = require('path');
const appDirectory = path.resolve(__dirname, '../');

module.exports = {
    entry: slsw.lib.entries,
    target: "node",
    devtool: 'source-map',
    externals: [nodeExternals()],
    mode: slsw.lib.webpack.isLocal ? "development" : "production",
    optimization: {
      minimize: false
    },
    performance: {
      hints: false
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/,
          loader: 'babel-loader'
        },
        {
          test: /\.(gif|jpe?g|png|svg)$/,
          use: {
            loader: 'url-loader',
            options: {
              name: '[name].[ext]'
            }
          }
        }
      ]
    },
    resolve: {
      alias: {
        'react-native$': 'react-native-web'
      },
      extensions: ['.web.js', '.js']
    }
};
```
