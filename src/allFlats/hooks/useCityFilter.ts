import { useState, useMemo, useEffect } from "react";
import type { FlatData } from "../types/allFlatsTypes";

interface UseCityFilterResult {
  activeCityFilter: string;
  handleCityFilterChange: (city: string) => void;
  applyCityFilter: (flats: FlatData[]) => FlatData[];
}

export const useCityFilter = (uniqueCities: string[]): UseCityFilterResult => {
  const [activeCityFilter, setActiveCityFilter] = useState<string>("Todos");

  useEffect(() => {
    if (uniqueCities.length > 0 && !uniqueCities.includes(activeCityFilter)) {
      setActiveCityFilter("Todos");
    }
  }, [uniqueCities, activeCityFilter]);

  const handleCityFilterChange = (city: string) => {
    setActiveCityFilter(city);
  };

  const applyCityFilter = useMemo(
    () => (flats: FlatData[]) => {
      if (activeCityFilter === "Todos") {
        return flats;
      }
      return flats.filter((flat) => flat.city === activeCityFilter);
    },
    [activeCityFilter]
  );

  return { activeCityFilter, handleCityFilterChange, applyCityFilter };
};
