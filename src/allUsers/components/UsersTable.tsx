import { useMemo } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import { useNavigate } from "react-router";
import type { AuthUser } from "../../auth/types/authTypes";
import type { CurrentSort, SortOrder } from "../types/allUserTypes";
import { StyledTableHeadCell } from "./StyledTableHeadCell";
import { StyledTableRow } from "./StyledTableRow";
import moment from "moment";
import { allUserStrings } from "../strings/allUserStrings";

interface UsersTableProps {
  users: AuthUser[];
  tableHead: string[];
  currentSort: CurrentSort;
  setCurrentSort: React.Dispatch<React.SetStateAction<CurrentSort>>;
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T): number {
  let valueA = a[orderBy];
  let valueB = b[orderBy];

  // Manejo específico para tipos de datos complejos
  if (orderBy === "birthday" || orderBy === "createdAt") {
    if (moment.isMoment(valueA) && moment.isMoment(valueB)) {
      if (valueB.isBefore(valueA)) return -1;
      if (valueB.isAfter(valueA)) return 1;
      return 0;
    }
  } else if (orderBy === "flats") {
    const lengthA = Array.isArray(valueA) ? valueA.length : 0;
    const lengthB = Array.isArray(valueB) ? valueB.length : 0;
    if (lengthB < lengthA) return -1;
    if (lengthB > lengthA) return 1;
    return 0;
  }

  // Comparación por defecto (cadena o número)
  if (valueB < valueA) {
    return -1;
  }
  if (valueB > valueA) {
    return 1;
  }
  return 0;
}

// Función que devuelve el comparador adecuado (ascendente o descendente)
const getComparator = (order: SortOrder, orderBy: keyof AuthUser) => {
  return order === "desc"
    ? (a: AuthUser, b: AuthUser) => descendingComparator(a, b, orderBy)
    : (a: AuthUser, b: AuthUser) => -descendingComparator(a, b, orderBy);
};

// Función para ordenar una lista de forma estable
const stableSort = <T,>(array: T[], comparator: (a: T, b: T) => number) => {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
};

export const UsersTable: React.FC<UsersTableProps> = ({
  users,
  tableHead,
  currentSort,
  setCurrentSort,
}) => {
  const navigate = useNavigate();

  const handleRequestSort = (property: keyof AuthUser) => {
    const isAsc = currentSort.field === property && currentSort.order === "asc";
    setCurrentSort({
      field: property,
      order: isAsc ? "desc" : "asc",
    });
  };

  const sortedUsers = useMemo(() => {
    if (currentSort.field === null || currentSort.order === null) {
      return users;
    }
    return stableSort(
      users,
      getComparator(currentSort.order, currentSort.field)
    );
  }, [users, currentSort]);

  const handleUserClick = (user: AuthUser) => {
    navigate(`/allUsers/${user.uid}`);
  };

  const sortableFields: (keyof AuthUser)[] = [
    "uid",
    "username",
    "firstName",
    "lastName",
    "email",
    "role",
    "birthday",
    "flats",
    "createdAt",
  ];

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="users table">
        <TableHead>
          <TableRow>
            {tableHead.map((headCell, index) => {
              const field = sortableFields[index];
              return (
                <StyledTableHeadCell
                  key={headCell}
                  $active={currentSort.field === field}
                  onClick={() => field && handleRequestSort(field)}
                >
                  <TableSortLabel
                    active={currentSort.field === field}
                    direction={
                      currentSort.field === field
                        ? currentSort.order || "asc"
                        : "asc"
                    }
                  >
                    {headCell}
                    {currentSort.field === field ? (
                      <Box component="span" sx={{ display: "none" }}>
                        {currentSort.order === "desc"
                          ? "sorted descending"
                          : "sorted ascending"}
                      </Box>
                    ) : null}
                  </TableSortLabel>
                </StyledTableHeadCell>
              );
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedUsers.map((user) => (
            <StyledTableRow
              key={user.uid}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              onClick={() => handleUserClick(user)}
            >
              <TableCell component="th" scope="row">
                {user.uid}
              </TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.firstName}</TableCell>
              <TableCell>{user.lastName}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                {moment(user.birthday).format("YYYY-MM-DD")}
              </TableCell>
              <TableCell>
                {Array.isArray(user.flats) ? user.flats.length : "N/A"}
              </TableCell>
              <TableCell>
                {moment(user.createdAt).format("YYYY-MM-DD")}
              </TableCell>
              <TableCell>
                <img
                  src={user.profilePicture}
                  alt={allUserStrings.imgAlt}
                  style={{
                    width: 50,
                    height: 50,
                    objectFit: "cover",
                    borderRadius: "4px",
                  }}
                />
              </TableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
