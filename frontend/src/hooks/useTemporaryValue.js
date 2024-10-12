import { useState, useEffect } from "react";

/**
 * Custom hook to set a temporary value for a given duration.
 * Automatically clears the value after the specified duration.
 *
 * @param {any} initialValue - The initial value to set.
 * @param {number} durationMs - The duration in milliseconds before clearing the value.
 * @returns {[any, Function]} - The current value and a setter function.
 */
const useTemporaryValue = (initialValue, durationMs) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    if (value !== initialValue) {
      const timer = setTimeout(() => {
        // Reset to the initial value after the duration
        setValue(initialValue);
      }, durationMs);

      // Cleanup timeout if component unmounts or value changes
      return () => clearTimeout(timer);
    }
  }, [value, initialValue, durationMs]);

  return [value, setValue];
};

export default useTemporaryValue;
