import { useRef } from 'react';

export function useLocalStore<T extends { destroy(): void }>(createStore: () => T): T {
  const storeRef = useRef<T | null>(null);

  if (!storeRef.current) {
    storeRef.current = createStore();
  }
  useRef(() => {
    return () => {
      storeRef.current?.destroy();
    };
  });

  return storeRef.current;
}
