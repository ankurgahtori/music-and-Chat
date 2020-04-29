module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '@root': './',
          '@assets': './assets',
          '@components': './components',
          '@config': './config',
          '@navigators': './navigators',
          '@screens': './screens',
          '@utils': './utils',
          '@locale': './locale',
        },
      },
    ],
  ],
};
