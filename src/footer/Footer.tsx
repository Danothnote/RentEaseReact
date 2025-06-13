import { Box, Grid, Link, Typography } from "@mui/material";
import { colors } from "../strings/colors";
import { footerStrings } from "./strings/footerStrings";

export const Footer = () => {
  return (
    <Box
      id="footer"
      component="footer"
      sx={{
        backgroundColor: colors.navbarBackground,
        color: colors.yellowText,
        py: 6,
        px: 3,
        mt: "auto",
      }}
    >
      <Typography
        variant="h4"
        component="h2"
        gutterBottom
        sx={{ mb: 6, fontWeight: "bold", textAlign: "center" }}
      >
        {footerStrings.title}
      </Typography>
      <Grid
        container
        spacing={4}
        justifyContent="space-around"
        sx={{ maxWidth: "lg", mx: "auto", mb: 4 }}
      >
        <Grid
          sx={{
            xs: 12,
            sm: 6,
            md: 3,
            width: "350px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h6"
            gutterBottom
            sx={{ fontWeight: "bold", mb: 2, textAlign: "center" }}
          >
            {footerStrings.about}
          </Typography>
          <Box component={"ul"} sx={{ textAlign: "left" }}>
            {footerStrings.aboutList.map((item) => {
              return (
                <Box component="li" key={item}>
                  <Typography variant="body2">{item}</Typography>
                </Box>
              );
            })}
          </Box>
        </Grid>

        <Grid
          sx={{
            xs: 12,
            sm: 6,
            md: 3,
            width: "350px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h6"
            gutterBottom
            sx={{ fontWeight: "bold", mb: 2, textAlign: "center" }}
          >
            {footerStrings.social}
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              mt: 1,
            }}
          >
            {footerStrings.socialList.map((item) => {
              return (
                <Link
                  key={item.name}
                  href={item.socialUrl}
                  target="_blank"
                  sx={{
                    my: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "left",
                    color: colors.yellowText,
                    textDecoration: "none",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  <img src={item.iconUrl} alt={item.name} width={"25px"} />
                  <Typography variant="body2" sx={{ ml: 2 }}>
                    {item.name}
                  </Typography>
                </Link>
              );
            })}
          </Box>
        </Grid>
        <Grid
          sx={{
            xs: 12,
            sm: 6,
            md: 3,
            width: "350px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h6"
            gutterBottom
            sx={{ fontWeight: "bold", mb: 2, textAlign: "center" }}
          >
            {footerStrings.contact}
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "left",
              color: colors.yellowText,
            }}
          >
            <img
              src={footerStrings.contactList[0].iconUrl}
              alt="whatsapp"
              width={"25px"}
            />
            <Typography variant="body1" sx={{ ml: 2 }}>
              {footerStrings.contactList[0].number}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
