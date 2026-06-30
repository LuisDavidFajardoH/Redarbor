module.exports = function (api) {
  api.cache.using(() => process.env.NODE_ENV);
  // NativeWind's babel transform injects a cssInterop import that breaks
  // jest.mock factories, so we skip it under test (styles aren't asserted there).;
