import { fireEvent, render, screen } from '@testing-library/react-native';

import { StateView } from './StateView';

describe('StateView', () => {
  it('renders the empty state with a custom message', () => {
    render(<StateView kind="empty" title="No favorites yet" message="Tap the heart" />);
    expect(screen.getByText('No favorites yet')).toBeTruthy();
    expect(screen.getByText('Tap the heart')).toBeTruthy();
  });

  it('shows a retry button on error and calls onRetry', () => {
    const onRetry = jest.fn();
    render(<StateView kind="error" onRetry={onRetry} />);
    fireEvent.press(screen.getByText('Reintentar'));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
