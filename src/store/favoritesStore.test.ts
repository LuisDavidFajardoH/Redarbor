import { sampleJob, sampleJob2 } from '@/test/fixtures';

import { selectFavoriteList, useFavoritesStore } from './favoritesStore';

describe('favoritesStore', () => {
  beforeEach(() => {
    useFavoritesStore.setState({ favorites: {} });
  });

  it('adds a job', () => {
    useFavoritesStore.getState().add(sampleJob);
    expect(useFavoritesStore.getState().isFavorite(sampleJob.id)).toBe(true);
  });

  it('removes a job', () => {
    const store = useFavoritesStore.getState();
    store.add(sampleJob);
    store.remove(sampleJob.id);
    expect(useFavoritesStore.getState().isFavorite(sampleJob.id)).toBe(false);
  });

  it('toggles a job on and off', () => {
    const { toggle } = useFavoritesStore.getState();
    toggle(sampleJob);
    expect(useFavoritesStore.getState().isFavorite(sampleJob.id)).toBe(true);
    toggle(sampleJob);
    expect(useFavoritesStore.getState().isFavorite(sampleJob.id)).toBe(false);
  });

  it('does not duplicate the same job', () => {
    const { add } = useFavoritesStore.getState();
    add(sampleJob);
    add(sampleJob);
    expect(selectFavoriteList(useFavoritesStore.getState())).toHaveLength(1);
  });

  it('selects the favorite list', () => {
    const { add } = useFavoritesStore.getState();
    add(sampleJob);
    add(sampleJob2);
    expect(selectFavoriteList(useFavoritesStore.getState())).toHaveLength(2);
  });
});
