import { PlacePicker } from "@googlemaps/extended-component-library/react";

import { Box } from "@mui/material";

/**
 * GoogleLocationSearch component that allows users to search for a location
 * using the Google Places API.
 * @param {Object} props - The component props
 * @param {Function} props.onPlaceChange - The callback function to call when a
 * place is selected
 * @param {Function} props.onRequestError - The callback function to call when
 * an error occurs during the request
 * @returns {JSX.Element}
 */
const GoogleLocationSearch = ({ onPlaceChange, onRequestError }) => {
  /**
   * Handles place change event, ensuring the place is not empty before calling
   * the onPlaceChange callback.
   * @param {Object} event - The place change event object
   * @returns {void}
   */
  const handlePlaceChange = (event) => {
    if (event.target.value) {
      const googlePlace = event.target.value;

      onPlaceChange(googlePlace);
    }
  };

  return (
    <Box>
      <PlacePicker
        country={["us", "ca"]} // Limit search to US and Canada
        onPlaceChange={handlePlaceChange}
        onRequestError={() => (error) => onRequestError(error)}
      />
    </Box>
  );
};

export default GoogleLocationSearch;
