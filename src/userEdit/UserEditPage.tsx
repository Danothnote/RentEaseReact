import { useNavigate, useParams } from "react-router";
import { useState, useMemo } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  Snackbar,
  Typography,
} from "@mui/material";
import { colors } from "../strings/colors";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { allUserStrings } from "../allUsers/strings/allUserStrings";
import { UserEditItem } from "./components/UserEditItem";
import { useProfile } from "./hooks/useProfile";
import moment from "moment";

export const UserEditPage = () => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const { profileId } = useParams<{ profileId: string }>();
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const navigate = useNavigate();

  const { profile, error, loading } = useProfile(profileId);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleBack = () => {
    navigate("/allUsers");
  };

  const profileDetails = useMemo(() => {
    if (!profile) return [];

    return [
      {
        id: "uid",
        label: allUserStrings.labels.uid,
        value: profile.uid,
        editable: false,
        type: "text",
      },
      {
        id: "username",
        label: allUserStrings.labels.username,
        value: profile.username,
        editable: true,
        type: "text",
      },
      {
        id: "firstName",
        label: allUserStrings.labels.firstName,
        value: profile.firstName,
        editable: true,
        type: "text",
      },
      {
        id: "lastName",
        label: allUserStrings.labels.lastName,
        value: profile.lastName,
        editable: true,
        type: "text",
      },
      {
        id: "email",
        label: allUserStrings.labels.email,
        value: profile.email,
        editable: false,
        type: "email",
      },
      {
        id: "role",
        label: allUserStrings.labels.role,
        value: profile.role,
        editable: true,
        type: "text",
      },
      {
        id: "birthday",
        label: allUserStrings.labels.birthday,
        value: profile.birthday
          ? moment(profile.birthday).format("YYYY-MM-DD")
          : "N/A",
        editable: true,
        type: "date",
      },
      {
        id: "flats",
        label: allUserStrings.labels.flats,
        value: profile.flats.length,
        editable: false,
        type: "number",
      },
      {
        id: "createdAt",
        label: allUserStrings.labels.createdAt,
        value: profile.createdAt
          ? moment(profile.createdAt).format("YYYY-MM-DD HH:mm")
          : "N/A",
        editable: false,
        type: "date",
      },
    ];
  }, [profile]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Cargando datos del usuario...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <Typography variant="h6" color="error">
          {error}
        </Typography>
        <Button onClick={handleBack} sx={{ mt: 2 }}>
          Volver a Usuarios
        </Button>
      </Box>
    );
  }

  if (!profile) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <Typography variant="h6" color="textSecondary">
          No se encontró el perfil del usuario.
        </Typography>
        <Button onClick={handleBack} sx={{ mt: 2 }}>
          Volver a Usuarios
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 3,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "90vh",
        bgcolor: colors.white,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          maxWidth: 700,
          width: "100%",
          borderRadius: 3,
          bgcolor: colors.grey,
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        <IconButton onClick={handleBack} sx={{ mb: 2 }}>
          <ArrowBackIcon sx={{ color: colors.titleColor }} />
        </IconButton>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            textAlign: "center",
            mb: 4,
            color: colors.titleColor,
            fontWeight: "bold",
          }}
        >
          Editar Perfil de Usuario
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          {profile.profilePicture ? (
            <img
              src={profile.profilePicture}
              alt={`${profile.firstName}-profilePicture`}
              style={{
                width: 150,
                height: 150,
                borderRadius: "50%",
                objectFit: "cover",
                border: `3px solid ${colors.primaryButtonBackground}`,
              }}
            />
          ) : (
            <Typography variant="body1" color="textSecondary">
              No hay imagen de perfil.
            </Typography>
          )}
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            mb: 4,
          }}
        >
          {profileDetails.map((item) => (
            <UserEditItem
              key={item.id}
              id={item.id}
              label={item.label}
              type={item.type}
              value={item.value}
              profileId={profileId!}
              editable={item.editable}
            />
          ))}
        </Box>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 2,
            mt: 4,
          }}
        >
          <Button
            variant="outlined"
            size="large"
            sx={{
              my: 2,
              mx: 2,
              borderWidth: colors.secondaryButtonBorderWidth,
              borderColor: colors.secondaryButtonBorderColor,
              color: colors.secondaryButtonTextColor,
              "&:hover": {
                backgroundColor: colors.secondaryButtonBackgroundHover,
              },
            }}
            onClick={handleBack}
          >
            Cancelar
          </Button>
        </Box>
      </Paper>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};
