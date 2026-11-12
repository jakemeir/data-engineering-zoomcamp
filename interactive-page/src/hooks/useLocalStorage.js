import { useState, useCallback } from 'react';

export const useLocalStorage = (storageKey, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const rawItem = window.localStorage.getItem(storageKey);
      return rawItem ? JSON.parse(rawItem) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (valueOrUpdater) => {
      setStoredValue((prevValue) => {
        const nextValue =
          typeof valueOrUpdater === 'function' ? valueOrUpdater(prevValue) : valueOrUpdater;
        try {
          window.localStorage.setItem(storageKey, JSON.stringify(nextValue));
        } catch {
          // Ignore storage quota errors
        }
        return nextValue;
      });
    },
    [storageKey]
  );

  return [storedValue, setValue];
};
