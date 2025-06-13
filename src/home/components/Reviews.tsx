import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  Rating,
  Stack,
  Typography,
} from "@mui/material";
import { homePageStrings } from "../strings/homePageStrings";
import { colors } from "../../strings/colors";

export const Reviews = () => {
  return (
    <Box
      sx={{
        py: 8,
        px: 2,
        background: colors.reviewsGradient,
        textAlign: "center",
      }}
    >
      <Typography
        variant="h4"
        component="h2"
        gutterBottom
        sx={{ mb: 6, fontWeight: "bold" }}
      >
        {homePageStrings.reseñasTitle}
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {homePageStrings.clientes.map((review) => (
          <Grid sx={{ xs: 12, sm: 6, md: 4 }} key={review.id}>
            <Card
              sx={{
                height: "100%",
                width: "225px",
                mx: "30px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: 3,
                borderRadius: 2,
              }}
            >
              <CardContent>
                <Stack spacing={2} alignItems="center">
                  <Box
                    sx={{
                      backgroundColor: colors.navbarBackground,
                      width: "225px",
                      py: 3,
                      position: "relative",
                      top: -16,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Avatar
                      alt={review.firstName}
                      src={review.avatar}
                      sx={{ width: 180, height: 180, mb: 1 }}
                    />
                  </Box>
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{ fontWeight: "medium" }}
                  >
                    {review.firstName + " " + review.lastName}
                  </Typography>
                  <Rating
                    name={`read-only-rating-${review.id}`}
                    value={review.stars}
                    precision={0.5}
                    readOnly
                  />
                </Stack>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mt: 3, fontStyle: "italic" }}
                >
                  "{review.review}"
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
