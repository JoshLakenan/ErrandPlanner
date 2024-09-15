// Helper function to convert snake_case to camelCase
const toCamelCase = (str) => {
  return str.replace(/(_\w)/g, (matches) => matches[1].toUpperCase());
};

/**
 * Recursively converts all keys in an object or array from snake_case to camelCase.
 * @param {Object|Array} obj - The object or array to convert.
 * @returns {Object|Array} - The object or array with all keys converted to camelCase.
 */
const convertKeysToCamelCase = (obj) => {
  // Check if the input is an array
  if (Array.isArray(obj)) {
    // If it's an array, map over the array and convert each item
    return obj.map((item) => convertKeysToCamelCase(item));
  } else if (obj !== null && typeof obj === "object") {
    // If it's an object, create a new object with camelCase keys
    return Object.keys(obj).reduce((acc, key) => {
      const camelCaseKey = toCamelCase(key);
      acc[camelCaseKey] = convertKeysToCamelCase(obj[key]);
      return acc;
    }, {});
  } else {
    // Return the value as is if it's not an object or array
    return obj;
  }
};

export default convertKeysToCamelCase;
