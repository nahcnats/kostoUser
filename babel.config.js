module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    'nativewind/babel',
    // This must be the last element
    'react-native-reanimated/plugin',
  ]
};
