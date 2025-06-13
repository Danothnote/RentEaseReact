import { useState, useMemo } from "react";
import type { FilterConfig, FlatData } from "../types/allFlatsTypes";
import { allFlatsStrings } from "../strings/allFlatsStrings";

interface UsePriceRangeFilterResult {
  priceRange: number[];
  handlePriceRangeChange: (_event: Event, newValue: number | number[]) => void;
  applyPriceRangeFilter: (flats: FlatData[]) => FlatData[];
  priceFilterConfig: FilterConfig | undefined;
}

export const usePriceRangeFilter = (): UsePriceRangeFilterResult => {
  const priceFilterConfig = useMemo(() => {
    return allFlatsStrings.filter.filters.find(
      (f) => f.id === "priceFilter" && f.type === "slider"
    );
  }, []);

  const [priceRange, setPriceRange] = useState<number[]>(() => {
    return priceFilterConfig?.defaultValue || [0, 1000];
  });

  const handlePriceRangeChange = (
    _event: Event,
    newValue: number | number[]
  ) => {
    setPriceRange(newValue as number[]);
  };

  const applyPriceRangeFilter = useMemo(
    () => (flats: FlatData[]) => {
      if (!priceRange || priceRange.length !== 2) {
        return flats;
      }
      return flats.filter(
        (flat) =>
          flat.rentPrice >= priceRange[0] && flat.rentPrice <= priceRange[1]
      );
    },
    [priceRange]
  );

  return {
    priceRange,
    handlePriceRangeChange,
    applyPriceRangeFilter,
    priceFilterConfig,
  };
};
