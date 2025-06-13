import { useState, useMemo } from "react";
import type { FilterConfig, FlatData } from "../types/allFlatsTypes";
import { allFlatsStrings } from "../strings/allFlatsStrings";

interface UseAreaRangeFilterResult {
  areaRange: number[];
  handleAreaRangeChange: (_event: Event, newValue: number | number[]) => void;
  applyAreaRangeFilter: (flats: FlatData[]) => FlatData[];
  areaFilterConfig: FilterConfig | undefined;
}

export const useAreaRangeFilter = (): UseAreaRangeFilterResult => {
  const areaFilterConfig = useMemo(() => {
    return allFlatsStrings.filter.filters.find(
      (f) => f.id === "areaFilter" && f.type === "slider"
    );
  }, []);

  const [areaRange, setAreaRange] = useState<number[]>(() => {
    return areaFilterConfig?.defaultValue || [0, 500];
  });

  const handleAreaRangeChange = (
    _event: Event,
    newValue: number | number[]
  ) => {
    setAreaRange(newValue as number[]);
  };

  const applyAreaRangeFilter = useMemo(
    () => (flats: FlatData[]) => {
      if (!areaRange || areaRange.length !== 2) {
        return flats;
      }
      return flats.filter(
        (flat) => flat.area >= areaRange[0] && flat.area <= areaRange[1]
      );
    },
    [areaRange]
  );

  return { areaRange, handleAreaRangeChange, applyAreaRangeFilter, areaFilterConfig };
};