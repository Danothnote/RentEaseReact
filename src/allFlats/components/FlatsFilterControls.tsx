import React from "react";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  Typography,
} from "@mui/material";
import type { FilterConfig } from "../types/allFlatsTypes";

interface FlatsFilterControlsProps {
  filterConfig: FilterConfig;
  activeCityFilter: string;
  handleCityFilterChange: (city: string) => void;
  uniqueCities: string[];
  priceRange: number[];
  handlePriceRangeChange: (_event: Event, newValue: number | number[]) => void;
  priceFilterConfig: FilterConfig | undefined;
  areaRange: number[];
  handleAreaRangeChange: (_event: Event, newValue: number | number[]) => void;
  areaFilterConfig: FilterConfig | undefined;
}

export const FlatsFilterControls: React.FC<FlatsFilterControlsProps> = ({
  filterConfig,
  activeCityFilter,
  handleCityFilterChange,
  uniqueCities,
  priceRange,
  handlePriceRangeChange,
  priceFilterConfig,
  areaRange,
  handleAreaRangeChange,
  areaFilterConfig,
}) => {
  if (filterConfig.type === "select") {
    if (filterConfig.id === "cityFilter") {
      return (
        <FormControl fullWidth margin="normal" key={filterConfig.id}>
          <InputLabel id={`${filterConfig.id}-label`}>
            {filterConfig.label}
          </InputLabel>
          <Select
            labelId={`${filterConfig.id}-label`}
            id={filterConfig.id}
            value={activeCityFilter}
            label={filterConfig.label}
            onChange={(e) => handleCityFilterChange(e.target.value as string)}
          >
            {uniqueCities.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      );
    }
    return null;
  } else if (filterConfig.type === "slider") {
    if (filterConfig.id === "priceFilter" && priceFilterConfig) {
      return (
        <Box sx={{ mt: 2, mx: 2 }} key={filterConfig.id}>
          <Typography id={`${filterConfig.id}-slider`} gutterBottom>
            {filterConfig.label}: {priceRange[0]} $/mes - {priceRange[1]} $/mes
          </Typography>
          <Slider
            value={priceRange}
            onChange={handlePriceRangeChange}
            valueLabelDisplay="auto"
            min={priceFilterConfig.min}
            max={priceFilterConfig.max}
            step={priceFilterConfig.step}
            aria-labelledby={`${filterConfig.id}-slider`}
            disableSwap
          />
        </Box>
      );
    } else if (filterConfig.id === "areaFilter" && areaFilterConfig) {
      return (
        <Box sx={{ mt: 2, mx: 2 }} key={filterConfig.id}>
          <Typography id={`${filterConfig.id}-slider`} gutterBottom>
            {filterConfig.label}: {areaRange[0]} m² - {areaRange[1]} m²
          </Typography>
          <Slider
            value={areaRange}
            onChange={handleAreaRangeChange}
            valueLabelDisplay="auto"
            min={areaFilterConfig.min}
            max={areaFilterConfig.max}
            step={areaFilterConfig.step}
            aria-labelledby={`${filterConfig.id}-slider`}
            disableSwap
          />
        </Box>
      );
    }
  }
  return null;
};
