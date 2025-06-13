import { useEffect, useMemo, useState } from "react";
import type { AuthUser } from "../auth/types/authTypes";
import { useSearch } from "./hooks/useSearch";
import { useUsers } from "./hooks/useUsers";
import {
  Box,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { colors } from "../strings/colors";
import { allUserStrings } from "./strings/allUserStrings";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import type { CurrentSort } from "./types/allUserTypes";
import { UsersTable } from "./components/UsersTable";

export const AllUsersPage = () => {
  const { allUsers, loading } = useUsers();
  const [users, setUsers] = useState<AuthUser[]>(allUsers);
  const { searchTerm, handleSearchChange, clearSearch, applySearch } =
    useSearch();
  const [currentSort, setCurrentSort] = useState<CurrentSort>({
    field: null,
    order: null,
  });

  useEffect(() => {
    setUsers(allUsers);
  }, [allUsers]);

  const filteredAndSearchedUsers = useMemo(() => {
    let tempUsers = [...users];

    // Aplicar búsqueda por término
    tempUsers = applySearch(tempUsers);

    return tempUsers;
  }, [users, applySearch]);

  return (
    <Box sx={{ display: "flex", overflow: "scroll", p: 2 }}>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 3,
          }}
        >
          <TextField
            variant="outlined"
            placeholder={allUserStrings.searchBar.placeholder}
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{ flexGrow: 1, mr: 2, maxWidth: "800px" }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchTerm ? (
                <InputAdornment position="end">
                  <IconButton onClick={clearSearch} edge="end">
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ) : undefined,
            }}
          />
        </Box>
        <Box pb={6}>
          {filteredAndSearchedUsers.length > 0 ? (
            <UsersTable
              users={filteredAndSearchedUsers}
              tableHead={allUserStrings.tableHead}
              currentSort={currentSort}
              setCurrentSort={setCurrentSort}
            />
          ) : (
            <Typography
              variant="h6"
              color="textSecondary"
              sx={{ textAlign: "center", mt: 5 }}
            >
              {allUserStrings.emptyLabel}
            </Typography>
          )}
        </Box>
      </Box>

      {loading && (
        <Box
          sx={{
            position: "fixed",
            bottom: 20,
            right: 20,
            display: "flex",
            alignItems: "center",
            bgcolor: colors.transparentWhite,
            p: 1.5,
            borderRadius: 2,
            boxShadow: 3,
            zIndex: 1000,
          }}
        >
          <CircularProgress
            size={20}
            sx={{ mr: 1, color: colors.titleColor }}
          />
          <Typography variant="body2" color="textSecondary">
            Cargando usuarios...
          </Typography>
        </Box>
      )}
    </Box>
  );
};
