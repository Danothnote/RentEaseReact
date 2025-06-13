import { Box, Button, Typography } from "@mui/material";
import { homePageStrings } from "../strings/homePageStrings";
import { colors } from "../../strings/colors";
import { HeroBox } from "../../components/HeroBox";
import { useNavigate } from "react-router";

export const HeroBanner = () => {
  const navigate = useNavigate();

  return (
    <HeroBox imageurl={homePageStrings.heroImageUrl}>
      <Box sx={{ zIndex: 2, position: "relative" }}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{ fontWeight: "bold", mx: 4 }}
        >
          {homePageStrings.heroText}
        </Typography>
        <Box>
          <Button
            variant="contained"
            size="large"
            sx={{
              fontSize: 18,
              fontWeight: 600,
              mx: 10,
              my: {xs: 5, sm: 7, md: 20},
              color: colors.heroPrimaryButtonTextColor,
              backgroundColor: colors.heroPrimaryButtonBackground,
              "&:hover": {
                backgroundColor: colors.heroPrimaryButtonHover,
              },
            }}
            onClick={() => navigate("/allFlats")}
          >
            {homePageStrings.primaryButton}
          </Button>
          <Button
            variant="outlined"
            size="large"
            sx={{
              fontSize: 18,
              fontWeight: 600,
              mx: 10,
              my: {xs: 5, sm: 7, md: 20},
              color: colors.heroSecondaryButtonTextColor,
              borderColor: colors.yellowText,
              borderWidth: colors.heroSecondaryButtonBorderWidth,
              "&:hover": {
                backgroundColor: colors.heroSecondaryButtonBackgroundHover,
                borderColor: colors.heroSecondaryButtonBorderHover,
                color: colors.heroSecondaryButtonBorderHover,
              },
            }}
            onClick={() => navigate("/newFlat")}
          >
            {homePageStrings.secondaryButton}
          </Button>
        </Box>
      </Box>
    </HeroBox>
  );
};
