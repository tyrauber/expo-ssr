# Expo SSR

Server Side Rendering with Expo, React Native Web and Express

A framework for a single monorepo, monolith javascript stack with a shared codebase for all clients - web, mobile applications, desktop applications, browser extensions, etc. 

Less Code, Better Performance, Quicker Development.

## Status

[NOT FOR PRODUCTION] In development. Dependencies, project structure, etc, may change.

## Expo Instructions

1. Clone the Repo
`$ git clone git@github.com:tyrauber/expo-ssr.git`

2. Install the dependencies
`$ yarn install`

3. Run expo
`$ expo start`

Expo Web and iOS Work.

## SSR Instructions

1. Build the server
` $ yarn dev:build`

2. Run the server
`$ yarn dev:start`

[1/8/21] Does not work. [See Issue #1](https://github.com/tyrauber/expo-ssr/issues/1)

```
.../node_modules/react-native-gesture-handler/index.js:1
export { default as Swipeable } from './Swipeable';
^^^^^^

SyntaxError: Unexpected token 'export'
```


## Stack

- [React](https://reactjs.org/) Javascript UI
- [ReactNativeWeb](https://necolas.github.io/react-native-web) React Native Components
- [ReactNavigation](https://reactnavigation.org/) React Routing
- [Expo](https://docs.expo.io/) Universal React Application Framework
- [Express](https://expressjs.com/) Express Framework

