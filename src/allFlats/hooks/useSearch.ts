import { useState, useMemo } from "react";
import type { FlatData } from "../types/allFlatsTypes";

interface UseSearchResult {
  searchTerm: string;
  handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  clearSearch: () => void;
  applySearch: (flats: FlatData[]) => FlatData[];
}

export const useSearch = (): UseSearchResult => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const applySearch = useMemo(
    () => (flats: FlatData[]) => {
      if (!searchTerm) {
        return flats;
      }
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      return flats.filter(
        (flat) =>
          flat.flatName.toLowerCase().includes(lowerCaseSearchTerm) ||
          flat.city.toLowerCase().includes(lowerCaseSearchTerm) ||
          String(flat.yearBuilt).toLowerCase().includes(lowerCaseSearchTerm)
      );
    },
    [searchTerm]
  );

  return { searchTerm, handleSearchChange, clearSearch, applySearch };
};
