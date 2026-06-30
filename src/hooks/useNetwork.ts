import NetInfo from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';

/** Reactive online/offline state for the offline-first banner. */
export function useNetwork(): { isOnline: boolean } {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(state.isConnected !== false);
    });
    return unsubscribe;
  }, []);

  return { isOnline };
}
