import { useState, useMemo } from "react";
import type { AuthUser } from "../../auth/types/authTypes";

interface UseSearchResult {
  searchTerm: string;
  handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  clearSearch: () => void;
  applySearch: (users: AuthUser[]) => AuthUser[];
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
    () => (users: AuthUser[]) => {
      if (!searchTerm) {
        return users;
      }
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      return users.filter(
        (user) =>
          user.firstName.toLowerCase().includes(lowerCaseSearchTerm) ||
          user.lastName.toLowerCase().includes(lowerCaseSearchTerm) ||
          user.email!!.toLowerCase().includes(lowerCaseSearchTerm) ||
          user.username.toLowerCase().includes(lowerCaseSearchTerm) ||
          user.role.toLowerCase().includes(lowerCaseSearchTerm)
      );
    },
    [searchTerm]
  );

  return { searchTerm, handleSearchChange, clearSearch, applySearch };
};
