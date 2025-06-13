import { TableCell } from "@mui/material";
import { colors } from "../../strings/colors";
import styled from "styled-components";

export const StyledTableHeadCell = styled(TableCell)<{ $active: boolean }>(
  ({ $active }) => ({
    backgroundColor: colors.navbarBackground,
    color: $active ? colors.heroSecondaryButtonBorderHover : colors.yellowText,
    fontWeight: "bold",
    "&:hover": {
      color: colors.heroSecondaryButtonBorderHover,
      cursor: "pointer",
    },
    "& .MuiTableSortLabel-root": {
      color: $active ? colors.heroSecondaryButtonBorderHover : colors.yellowText,
      "&:hover": {
        color: colors.heroSecondaryButtonBorderHover,
      },
      "&.Mui-active": {
        color: colors.heroSecondaryButtonBorderHover,
      },
      "& .MuiTableSortLabel-icon": {
        color: `${colors.heroSecondaryButtonBorderHover} !important`,
      },
    },
  })
);