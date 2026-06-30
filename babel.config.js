module.exports = function (api) {
  api.cache.using(() => process.env.NODE_ENV);
  // NativeWind's babel transform injects a cssInterop import that breaks
  // jest.mock factories, so we skip it under test (styles aren't asserted there).
  const isTest = process.env.NODE_ENV === 'test';
  return {
    presets: [
      ['babel-preset-expo', isTest ? {} : { jsxImportSource: 'nativewind' }],
      ...(isTest ? [] : ['nativewind/babel']),
    ],
    // Reanimated's worklet plugin MUST be last; without it the runtime throws
    // `__reanimatedLoggerConfig doesn't exist` and screens fail to mount.
    plugins: isTest ? [] : ['react-native-reanimated/plugin'],
  };
};
