import { useState, useCallback } from 'react';

// ----------------------------------------------------------------------

/**
 * @typedef {Object} ReturnType
 * @property {boolean} value
 * @property {function(): void} onTrue
 * @property {function(): void} onFalse
 * @property {function(): void} onToggle
 * @property {function(boolean): void} setValue
 */

/**
 * Custom hook to manage boolean state
 * @param {boolean} [defaultValue]
 * @returns {ReturnType}
 */
export function useBoolean(defaultValue) {
  const [value, setValue] = useState(!!defaultValue);

  const onTrue = useCallback(() => {
    setValue(true);
  }, []);

  const onFalse = useCallback(() => {
    setValue(false);
  }, []);

  const onToggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);

  return {
    value,
    onTrue,
    onFalse,
    onToggle,
    setValue,
  };
}
