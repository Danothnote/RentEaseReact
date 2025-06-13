import styled from "styled-components";
import { colors } from "../strings/colors";
import { Box } from "@mui/material";

interface HeroBoxProps {
  imageurl: string;
}

export const HeroBox = styled(Box)<HeroBoxProps>(({imageurl}) => ({
  backgroundImage: `url(${imageurl})`,
  backgroundSize: "cover",
  backgroundPosition: "bottom",
  height: "93vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  color: colors.yellowText,
  textAlign: "center",
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.heroImageOverlay,
    zIndex: 1,
  },
}));