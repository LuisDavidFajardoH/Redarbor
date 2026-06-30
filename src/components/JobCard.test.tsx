import { fireEvent, render, screen } from '@testing-library/react-native';

import { useFavoritesStore } from '@/store/favoritesStore';
import { sampleJob } from '@/test/fixtures';

import { JobCard } from './JobCard';

describe('JobCard', () => {
  beforeEach(() => {
    useFavoritesStore.setState({ favorites: {} });
  });

  it('renders job title and company', () => {
    render(<JobCard job={sampleJob} onPress={jest.fn()} />);
    expect(screen.getByText(sampleJob.title)).toBeTruthy();
    expect(screen.getByText(sampleJob.company_name)).toBeTruthy();
  });

  it('calls onPress when the card is tapped', () => {
    const onPress = jest.fn();
    render(<JobCard job={sampleJob} onPress={onPress} />);
    fireEvent.press(
      screen.getByLabelText(
        `Empleo: ${sampleJob.title} en ${sampleJob.company_name}, en cualquier lugar`,
      ),
    );
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('toggles favorite via the heart button', () => {
    render(<JobCard job={sampleJob} onPress={jest.fn()} />);
    fireEvent.press(screen.getByLabelText('Añadir a favoritos'));
    expect(useFavoritesStore.getState().isFavorite(sampleJob.id)).toBe(true);
    fireEvent.press(screen.getByLabelText('Quitar de favoritos'));
    expect(useFavoritesStore.getState().isFavorite(sampleJob.id)).toBe(false);
  });
});
