import { useCallback, useEffect, useMemo, useState } from "react";
import type { CurrentSort, FlatData } from "./types/allFlatsTypes";
import { allFlatsStrings } from "./strings/allFlatsStrings";
import {
  Box,
  CircularProgress,
  Drawer,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import CloseIcon from "@mui/icons-material/Close";
import GridViewIcon from "@mui/icons-material/GridView";
import TableRowsIcon from "@mui/icons-material/TableRows";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { FlatsGrid } from "./components/FlatsGrid";
import { FlatsTable } from "./components/FlatsTable";
import { colors } from "../strings/colors";
import { useFlats } from "./hooks/useFlats";
import { useSearch } from "./hooks/useSearch";
import { useCityFilter } from "./hooks/useCityFilter";
import { usePriceRangeFilter } from "./hooks/usePriceRangeFilter";
import { useAreaRangeFilter } from "./hooks/useAreaRangeFilter";
import { FlatsFilterControls } from "./components/FlatsFilterControls";

export const AllFlatsPage = () => {
  const { allFlats, uniqueCities, loading } = useFlats();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [showFavorites, setShowFavorites] = useState(false);
  const [currentSort, setCurrentSort] = useState<CurrentSort>({
    field: null,
    order: null,
  });
  const [flats, setFlats] = useState<FlatData[]>(allFlats);
  const { searchTerm, handleSearchChange, clearSearch, applySearch } =
    useSearch();
  const { activeCityFilter, handleCityFilterChange, applyCityFilter } =
    useCityFilter(uniqueCities);
  const {
    priceRange,
    handlePriceRangeChange,
    applyPriceRangeFilter,
    priceFilterConfig,
  } = usePriceRangeFilter();
  const {
    areaRange,
    handleAreaRangeChange,
    applyAreaRangeFilter,
    areaFilterConfig,
  } = useAreaRangeFilter();

  useEffect(() => {
    setFlats(allFlats);
  }, [allFlats]);

  // Función para manejar el cambio de favorito en un departamento
  const toggleFavorite = useCallback((id: string) => {
    setFlats((prevFlats) =>
      prevFlats.map((flat) =>
        flat.id === id ? { ...flat, isFavorite: !flat.isFavorite } : flat
      )
    );
  }, []);

  // Lógica de filtrado y búsqueda
  const filteredAndSearchedFlats = useMemo(() => {
    let tempFlats = [...flats];

    // 1. Filtrar por favoritos
    if (showFavorites) {
      tempFlats = tempFlats.filter((flat) => flat.isFavorite);
    }

    // 2. Aplicar filtros usando los hooks
    tempFlats = applyCityFilter(tempFlats);
    tempFlats = applyPriceRangeFilter(tempFlats);
    tempFlats = applyAreaRangeFilter(tempFlats);

    // 3. Aplicar búsqueda por término
    tempFlats = applySearch(tempFlats);

    return tempFlats;
  }, [
    flats,
    showFavorites,
    applyCityFilter,
    applyPriceRangeFilter,
    applyAreaRangeFilter,
    applySearch,
  ]);

  return (
    <Box sx={{ display: "flex", overflow: "scroll" }}>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        onClick={() => setIsSidebarOpen(true)}
        sx={{
          mr: 2,
          display: { md: "none" },
          position: "fixed",
          top: 70,
          left: 10,
          zIndex: 2,
        }}
      >
        <FilterAltIcon
          sx={{ color: colors.white, position: "absolute", top: -53, left: 15 }}
        />
      </IconButton>
      <Drawer
        variant="temporary"
        open={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          width: 240,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: 240,
            boxSizing: "border-box",
            bgcolor: colors.white,
          },
          display: { xs: "block", md: "none" },
        }}
      >
        <Box sx={{ p: 2, color: colors.white }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6" sx={{ color: colors.titleColor }}>
              {allFlatsStrings.filter.label}
            </Typography>
            <IconButton
              onClick={() => setIsSidebarOpen(false)}
              sx={{ color: colors.navbarBackground }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          {allFlatsStrings.filter.filters.map((filter) => (
            <FlatsFilterControls
              key={filter.id}
              filterConfig={filter}
              activeCityFilter={activeCityFilter}
              handleCityFilterChange={handleCityFilterChange}
              uniqueCities={uniqueCities}
              priceRange={priceRange}
              handlePriceRangeChange={handlePriceRangeChange}
              priceFilterConfig={priceFilterConfig}
              areaRange={areaRange}
              handleAreaRangeChange={handleAreaRangeChange}
              areaFilterConfig={areaFilterConfig}
            />
          ))}
        </Box>
      </Drawer>
      <Box
        sx={{
          width: 240,
          flexShrink: 0,
          display: { xs: "none", md: "block" },
          borderRight: "1px solid rgba(0, 0, 0, 0.23)",
          bgcolor: colors.white,
          pt: 4,
          px: 2,
          color: colors.titleColor,
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
          {allFlatsStrings.filter.label}
        </Typography>
        {allFlatsStrings.filter.filters.map((filter) => (
          <FlatsFilterControls
            key={filter.id}
            filterConfig={filter}
            activeCityFilter={activeCityFilter}
            handleCityFilterChange={handleCityFilterChange}
            uniqueCities={uniqueCities}
            priceRange={priceRange}
            handlePriceRangeChange={handlePriceRangeChange}
            priceFilterConfig={priceFilterConfig}
            areaRange={areaRange}
            handleAreaRangeChange={handleAreaRangeChange}
            areaFilterConfig={areaFilterConfig}
          />
        ))}
      </Box>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: viewMode === "grid" ? "center" : "left",
            mb: 3,
          }}
        >
          <TextField
            variant="outlined"
            placeholder={allFlatsStrings.searchBar.placeholder}
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{ flexGrow: 1, mr: 2, maxWidth: "400px" }}
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
          <Box sx={{ minWidth: "fit-content" }}>
            <IconButton
              color="primary"
              onClick={() => setViewMode("grid")}
              sx={{ color: viewMode === "grid" ? "#1976d2" : "action.active" }}
              title={allFlatsStrings.toggleButton.gridIconTooltip}
            >
              <GridViewIcon />
            </IconButton>
            <IconButton
              color="primary"
              onClick={() => setViewMode("table")}
              sx={{ color: viewMode === "table" ? "#1976d2" : "action.active" }}
              title={allFlatsStrings.toggleButton.tableIconTooltip}
            >
              <TableRowsIcon />
            </IconButton>
            <IconButton
              color="primary"
              onClick={() => setShowFavorites((prev) => !prev)}
              sx={{
                color: showFavorites ? colors.starYellow : "action.active",
              }}
              title={allFlatsStrings.favoriteButton.tooltip}
            >
              {showFavorites ? <StarIcon /> : <StarBorderIcon />}
            </IconButton>
          </Box>
        </Box>

        {/* Renderizado de los departamentos */}
        <Box pb={6}>
          {filteredAndSearchedFlats.length > 0 ? (
            viewMode === "grid" ? (
              <FlatsGrid
                flats={filteredAndSearchedFlats}
                toggleFavorite={toggleFavorite}
              />
            ) : (
              <FlatsTable
                flats={filteredAndSearchedFlats}
                toggleFavorite={toggleFavorite}
                tableHead={allFlatsStrings.tableHead}
                currentSort={currentSort}
                setCurrentSort={setCurrentSort}
              />
            )
          ) : (
            <Typography
              variant="h6"
              color="textSecondary"
              sx={{ textAlign: "center", mt: 5 }}
            >
              {allFlatsStrings.emptyLabel}
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
            Cargando departamentos...
          </Typography>
        </Box>
      )}
    </Box>
  );
};
