import React, { useState } from "react";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";

const DropdownSelect = ({
  label,
  items,
  onValueChange,
  size,
  defaultValue,
}) => {
  const [selectedValue, setSelectedValue] = useState(defaultValue || "");

  const handleChange = (event) => {
    const newValue = event.target.value;
    setSelectedValue(newValue);

    // Call the onValueChange callback function with the new value
    onValueChange(newValue);
  };

  return (
    <FormControl fullWidth sx={size}>
      <InputLabel id="dynamic-select-label">{label}</InputLabel>
      <Select
        labelId="dynamic-select-label"
        id="dynamic-select"
        value={selectedValue}
        label={label}
        onChange={handleChange}
      >
        {items.map((item, index) => (
          <MenuItem key={index} value={item.value}>
            {item.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default DropdownSelect;
