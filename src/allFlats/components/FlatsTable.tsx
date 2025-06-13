import type { Moment } from "moment";
import type { CurrentSort, FlatData, SortOrder } from "../types/allFlatsTypes";
import { useMemo } from "react";
import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from "@mui/material";
import { allFlatsStrings } from "../strings/allFlatsStrings";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { useNavigate } from "react-router";
import { StyledTableRow } from "./StyledTableRow";
import { StyledTableHeadCell } from "./StyledTableHeadCell";

interface FlatsTableProps {
  flats: FlatData[];
  toggleFavorite: (id: string) => void;
  tableHead: string[];
  currentSort: CurrentSort;
  setCurrentSort: React.Dispatch<React.SetStateAction<CurrentSort>>;
}

const stableSort = <T,>(array: T[], comparator: (a: T, b: T) => number) => {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
};

const getComparator = (order: SortOrder, orderBy: keyof FlatData) => {
  return order === "desc"
    ? (a: FlatData, b: FlatData) => descendingComparator(a, b, orderBy)
    : (a: FlatData, b: FlatData) => -descendingComparator(a, b, orderBy);
};

const descendingComparator = (
  a: FlatData,
  b: FlatData,
  orderBy: keyof FlatData
): number => {
  if (
    orderBy === "rentPrice" ||
    orderBy === "area" ||
    orderBy === "yearBuilt"
  ) {
    const valA = a[orderBy] as number;
    const valB = b[orderBy] as number;

    if (valB < valA) return -1;
    if (valB > valA) return 1;
    return 0;
  }
  // Manejo para fechas
  if (orderBy === "dateAvailable") {
    const dateA = a[orderBy] as Moment | null;
    const dateB = b[orderBy] as Moment | null;
    if (!dateA && !dateB) return 0;
    if (!dateA) return 1;
    if (!dateB) return -1;
    return dateB.diff(dateA);
  }

  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
};

export const FlatsTable: React.FC<FlatsTableProps> = ({
  flats,
  toggleFavorite,
  tableHead,
  currentSort,
  setCurrentSort,
}) => {
  const navigate = useNavigate();

  const handleRequestSort = (property: keyof FlatData) => {
    const isAsc = currentSort.field === property && currentSort.order === "asc";
    setCurrentSort({
      field: property,
      order: isAsc ? "desc" : "asc",
    });
  };

  const sortedFlats = useMemo(() => {
    if (!currentSort.field || !currentSort.order) {
      return flats;
    }
    return stableSort(
      flats,
      getComparator(currentSort.order, currentSort.field)
    );
  }, [flats, currentSort]);

  const handleFlatClick = (flat: FlatData) => {
    navigate(`/flat/${flat.id}`);
  };

  const headCellMapping: { [key: string]: keyof FlatData } = {
    Nombre: "flatName",
    Ciudad: "city",
    Calle: "street",
    Número: "streetNumber",
    Área: "area",
    "A/C": "airConditioning",
    "Año de construcción": "yearBuilt",
    "Fecha de disponibilidad": "dateAvailable",
    "Precio de renta": "rentPrice",
    Creado: "createdAt",
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {tableHead.map((headLabel) => {
              const sortableField = headCellMapping[headLabel];
              const isActive = sortableField === currentSort.field;

              return (
                <StyledTableHeadCell
                  key={headLabel}
                  $active={isActive}
                  sortDirection={
                    isActive ? currentSort.order || undefined : undefined
                  }
                >
                  {sortableField ? (
                    <TableSortLabel
                      active={isActive}
                      direction={isActive ? currentSort.order || "asc" : "asc"}
                      onClick={() => handleRequestSort(sortableField)}
                    >
                      {headLabel}
                    </TableSortLabel>
                  ) : (
                    <Typography component="span">{headLabel}</Typography>
                  )}
                </StyledTableHeadCell>
              );
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedFlats.map((flat) => (
            <StyledTableRow
              key={flat.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              onClick={() => handleFlatClick(flat)}
            >
              <TableCell component="th" scope="row">
                {flat.flatName}
              </TableCell>
              <TableCell>{flat.city}</TableCell>
              <TableCell>{flat.street}</TableCell>
              <TableCell>{flat.streetNumber}</TableCell>
              <TableCell>{flat.area}</TableCell>
              <TableCell>{flat.airConditioning}</TableCell>
              <TableCell>{flat.yearBuilt}</TableCell>
              <TableCell>
                {flat.dateAvailable
                  ? flat.dateAvailable.format("YYYY-MM-DD")
                  : "N/A"}
              </TableCell>
              <TableCell>
                {flat.createdAt ? flat.createdAt.format("YYYY-MM-DD") : "N/A"}
              </TableCell>
              <TableCell>{flat.rentPrice}</TableCell>
              <TableCell>
                <img
                  src={flat.imgUpload[0]}
                  alt={allFlatsStrings.imgAlt}
                  style={{
                    width: 50,
                    height: 50,
                    objectFit: "cover",
                    borderRadius: "4px",
                  }}
                />
              </TableCell>
              <TableCell>
                <IconButton
                  sx={{ color: flat.isFavorite ? "#FFD700" : "default" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(flat.id);
                  }}
                  title={allFlatsStrings.favorite.tooltip}
                >
                  {flat.isFavorite ? <StarIcon /> : <StarBorderIcon />}
                </IconButton>
              </TableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
