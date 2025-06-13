import styled from "styled-components";
import { colors } from "../../strings/colors";
import { TableRow } from "@mui/material";

export const StyledTableRow = styled(TableRow)`
  &:hover {
    background-color: ${colors.starBackgroundHover} !important; /* Color al pasar el mouse */
    cursor: pointer;
  }
`;