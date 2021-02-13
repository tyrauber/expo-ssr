import Koa from 'koa';
import * as React from 'react';
import ReactDOMServer from 'react-dom/server';
import { AppRegistry } from 'react-native-web';
import { ServerContainer, ServerContainerRef } from '@react-navigation/native';
import serverless from 'serverless-http';

const app = new Koa();

import App from './App';


// app.use(async (ctx) => {
//   ctx.body = "Hello World"
// })


app.use(async (ctx) => {

  AppRegistry.registerComponent('App', () => App);
  const location = new URL(ctx.url, 'http://localhost:3000/');
  //console.log(ctx.url, location)

  const { element, getStyleElement } = AppRegistry.getApplication('App');

  const html = ReactDOMServer.renderToString(
    <ServerContainer location={location}>{element}</ServerContainer>
  );

  const css = ReactDOMServer.renderToStaticMarkup(getStyleElement());

  const document = `
    <!DOCTYPE html>
    <html style="height: 100%">
    <meta charset="utf-8">
    <meta httpEquiv="X-UA-Compatible" content="IE=edge">
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1.00001, viewport-fit=cover"
    >
    ${css}
    <body style="min-height: 100%">
    <div id="root" style="display: flex; min-height: 100vh">
    ${html}
    </div>
`;

  ctx.body = document;
});

const PORT = process.env.PORT || 3000;

if(!(process.env._HANDLER) && process.env.NODE_ENV !== 'test') {
  const { PORT = 80 } = process.env;
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}!`);
  });
}

exports.app = app;
exports.web = serverless(app);