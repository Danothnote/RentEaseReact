import { Box, Grid, IconButton, Paper, Typography } from "@mui/material";
import type { FlatData } from "../types/allFlatsTypes";
import { allFlatsStrings } from "../strings/allFlatsStrings";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { colors } from "../../strings/colors";
import { useNavigate } from "react-router";

interface FlatsGridProps {
  flats: FlatData[];
  toggleFavorite: (id: string) => void;
}

export const FlatsGrid: React.FC<FlatsGridProps> = ({
  flats,
  toggleFavorite,
}) => {
  const navigate = useNavigate();

  const handleFlatClick = (flat: FlatData) => {
    navigate(`/flat/${flat.id}`);
  };

  return (
    <Grid container columnSpacing={3} rowSpacing={8} justifyContent={"center"}>
      {flats.map((flat) => (
        <Grid sx={{ xs: 12, sm: 6, md: 4 }} key={flat.id}>
          <Paper
            elevation={3}
            sx={{
              pb: 2,
              display: "flex",
              flexDirection: "column",
              width: 300,
              height: "100%",
              bgcolor: colors.grey,
              cursor: "pointer",
            }}
            onClick={() => handleFlatClick(flat)}
          >
            <Box sx={{ position: "relative", mb: 2 }}>
              <img
                src={flat.imgUpload[0]}
                alt={allFlatsStrings.imgAlt}
                style={{
                  width: "100%",
                  height: 200,
                  objectFit: "cover",
                  borderRadius: "4px",
                }}
              />
              <IconButton
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  color: flat.isFavorite ? colors.starYellow : colors.grey,
                  bgcolor: colors.starBackground,
                  "&:hover": { bgcolor: colors.starBackgroundHover },
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(flat.id);
                }}
                title={allFlatsStrings.favorite.tooltip}
              >
                {flat.isFavorite ? <StarIcon /> : <StarBorderIcon />}
              </IconButton>
            </Box>
            <Box sx={{ px: 4 }}>
              <Typography
                variant="h6"
                component="h3"
                sx={{ mb: 1, fontWeight: "bold", color: colors.titleColor }}
              >
                {flat.flatName}
              </Typography>
              <Typography variant="body1" color={colors.titleColor}>
                <span style={{ fontWeight: "bold" }}>
                  {allFlatsStrings.labels.city}
                </span>
                {flat.city}
              </Typography>
              <Typography variant="body1" color={colors.titleColor}>
                <span style={{ fontWeight: "bold" }}>
                  {allFlatsStrings.labels.address}
                </span>
                {flat.street}, {flat.streetNumber}
              </Typography>
              <Typography variant="body1" color={colors.titleColor}>
                <span style={{ fontWeight: "bold" }}>
                  {allFlatsStrings.labels.area}
                </span>
                {flat.area}m²
              </Typography>
              <Typography variant="body1" color={colors.titleColor}>
                <span style={{ fontWeight: "bold" }}>
                  {allFlatsStrings.labels.airConditioning}
                </span>
                {flat.airConditioning}
              </Typography>
              <Typography variant="body1" color={colors.titleColor}>
                <span style={{ fontWeight: "bold" }}>
                  {allFlatsStrings.labels.yearBuilt}
                </span>
                {flat.yearBuilt}
              </Typography>
              <Typography variant="body1" color={colors.titleColor}>
                <span style={{ fontWeight: "bold" }}>
                  {allFlatsStrings.labels.dateAvailable}
                </span>
                {flat.dateAvailable
                  ? flat.dateAvailable.format("YYYY-MM-DD")
                  : "N/A"}
              </Typography>
              <Typography variant="body1" color={colors.titleColor}>
                <span style={{ fontWeight: "bold" }}>
                  {allFlatsStrings.labels.createdAt}
                </span>
                {flat.createdAt ? flat.createdAt.format("YYYY-MM-DD") : "N/A"}
              </Typography>
              <Typography
                variant="h6"
                color={colors.titleColor}
                sx={{ mt: "auto", pt: 2 }}
              >
                <span style={{ fontWeight: "bold" }}>
                  {allFlatsStrings.labels.rentPrice}
                </span>
                ${flat.rentPrice}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};
