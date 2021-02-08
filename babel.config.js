module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo',"@babel/preset-env", "@babel/preset-react"],
    plugins: [
      [
        "module-resolver",
        {
          alias: {
            'react-native': 'react-native-web'
          }
        }
      ]
    ]
  }
};
