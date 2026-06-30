// Testing Library matchers are bundled with @testing-library/react-native v12.4+.

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

// Silence/replace native-only modules that don't run in jsdom/node.
jest.mock('expo-blur', () => {
  const React = require('react');
  const { View } = require('react-native');
  return { BlurView: (props) => React.createElement(View, props, props.children) };
});

jest.mock('expo-image', () => {
  const React = require('react');
  const { Image } = require('react-native');
  return { Image: (props) => React.createElement(Image, props) };
});

// moti relies on reanimated worklets; swap its primitives for plain views in tests.
jest.mock('moti', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    MotiView: (props) => React.createElement(View, props, props.children),
    MotiText: (props) => React.createElement(Text, props, props.children),
  };
});

jest.mock('@react-native-community/netinfo', () => ({
  addEventListener: jest.fn(() => jest.fn()),
  fetch: jest.fn(() => Promise.resolve({ isConnected: true })),
}));

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(() => Promise.resolve()),
  selectionAsync: jest.fn(() => Promise.resolve()),
  notificationAsync: jest.fn(() => Promise.resolve()),
  ImpactFeedbackStyle: { Light: 'light', Medium: 'medium', Heavy: 'heavy' },
  NotificationFeedbackType: { Success: 'success', Warning: 'warning', Error: 'error' },
}));

// react-native-gesture-handler ships a jest setup for Swipeable/GestureDetector.
require('react-native-gesture-handler/jestSetup');

jest.mock('react-native-gesture-handler/ReanimatedSwipeable', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: React.forwardRef((props, _ref) => React.createElement(View, props, props.children)),
  };
});
