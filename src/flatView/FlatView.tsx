import { useNavigate, useParams } from "react-router";
import { useContext, useEffect, useState } from "react";
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
import { allFlatsStrings } from "../allFlats/strings/allFlatsStrings";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { AuthContext } from "../auth/context/AuthContext";
import { FlatViewItem } from "./components/FlatViewItem";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useDeleteFlat } from "./hooks/useDeleteFlat";
import { useFlat } from "./hooks/useFlat";

export const FlatView = () => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const { flatId } = useParams<{ flatId: string }>();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const {
    deleteFlat,
    loading: deleteLoading,
    error: deleteError,
    success: deleteSuccess,
  } = useDeleteFlat();

  // Intenta obtener el flat del estado de navegación
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { flat, error, loading } = useFlat(flatId);

  useEffect(() => {
    if (deleteSuccess) {
      setSnackbarMessage("Departamento eliminado exitosamente.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      navigate(-1);
    } else if (deleteError) {
      setSnackbarMessage(deleteError);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  }, [deleteSuccess, deleteError, navigate]);

  const handleDelete = async () => {
    if (
      flat?.id &&
      window.confirm("¿Estás seguro de que quieres eliminar este departamento?")
    ) {
      await deleteFlat(flat.id, flat.imgUpload);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleNextImage = () => {
    if (flat?.imgUpload && flat.imgUpload.length > 0) {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % flat.imgUpload.length
      );
    }
  };

  const handlePrevImage = () => {
    if (flat?.imgUpload && flat.imgUpload.length > 0) {
      setCurrentImageIndex(
        (prevIndex) =>
          (prevIndex - 1 + flat.imgUpload.length) % flat.imgUpload.length
      );
    }
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index);
  };

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
          Cargando departamento...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
          flexDirection: "column",
        }}
      >
        <Typography variant="h6" color="error">
          {error}
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate(-1)}
          sx={{ mt: 2 }}
        >
          Volver a la lista
        </Button>
      </Box>
    );
  }

  if (!flat) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <Typography variant="h6" color="error">
          Error desconocido: Departamento no disponible.
        </Typography>
      </Box>
    );
  }

  const flatDetails = [
    { id: "city", label: allFlatsStrings.labels.city, value: flat.city },
    {
      id: "address",
      label: allFlatsStrings.labels.address,
      value: `${flat.street} ${flat.streetNumber}`,
    },
    {
      id: "area",
      label: allFlatsStrings.labels.area,
      value: `${flat.area} m²`,
    },
    {
      id: "airConditioning",
      label: allFlatsStrings.labels.airConditioning,
      value: flat.airConditioning,
    },
    {
      id: "yearBuilt",
      label: allFlatsStrings.labels.yearBuilt,
      value: flat.yearBuilt,
    },
    {
      id: "dateAvailable",
      label: allFlatsStrings.labels.dateAvailable,
      value: flat.dateAvailable
        ? flat.dateAvailable.format("YYYY-MM-DD")
        : "N/A",
    },
    {
      id: "createdAt",
      label: allFlatsStrings.labels.createdAt,
      value: flat.createdAt ? flat.createdAt.format("YYYY-MM-DD") : "N/A",
    },
    {
      id: "rentPrice",
      label: allFlatsStrings.labels.rentPrice,
      value: `$ ${flat.rentPrice}`,
    },
  ];

  return (
    <Box sx={{ p: 4, maxWidth: 800, mx: "auto", mt: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          sx={{
            color: colors.secondaryButtonTextColor,
            borderColor: colors.secondaryButtonBorderColor,
            ":hover": {
              bgcolor: colors.secondaryButtonBackgroundHover,
            },
          }}
          onClick={() => navigate(-1)}
        >
          Volver
        </Button>
        {flat.uid === user?.uid ? (
          <Button
            variant="outlined"
            startIcon={<DeleteForeverIcon />}
            sx={{
              color: colors.deleteButtonTextColor,
              borderColor: colors.deleteButtonBorderColor,
              ":hover": {
                bgcolor: colors.deleteButtonBackgroundHover,
              },
            }}
            onClick={handleDelete}
            disabled={deleteLoading}
          >
            {deleteLoading ? (
              <CircularProgress size={24} sx={{ color: colors.titleColor }} />
            ) : (
              "Eliminar"
            )}
          </Button>
        ) : (
          <></>
        )}
      </Box>

      <Paper elevation={3} sx={{ p: 3, mb: 4, bgcolor: colors.grey }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ color: colors.titleColor, fontWeight: "bold" }}
        >
          {flat.flatName}
        </Typography>

        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            mb: 3,
            borderRadius: 2,
          }}
        >
          {flat.imgUpload && flat.imgUpload.length > 0 ? (
            <>
              <img
                src={flat.imgUpload[currentImageIndex]}
                alt={`${flat.flatName} - ${currentImageIndex + 1}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  display: "block",
                }}
              />
              {flat.imgUpload.length > 1 && (
                <>
                  <IconButton
                    onClick={handlePrevImage}
                    sx={{
                      position: "absolute",
                      left: 10,
                      top: "50%",
                      transform: "translateY(-50%)",
                      bgcolor: "rgba(0,0,0,0.5)",
                      color: "white",
                      "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
                    }}
                  >
                    <ArrowBackIosNewIcon />
                  </IconButton>
                  <IconButton
                    onClick={handleNextImage}
                    sx={{
                      position: "absolute",
                      right: 10,
                      top: "50%",
                      transform: "translateY(-50%)",
                      bgcolor: "rgba(0,0,0,0.5)",
                      color: "white",
                      "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
                    }}
                  >
                    <ArrowForwardIosIcon />
                  </IconButton>
                </>
              )}
              <Box
                sx={{
                  display: "flex",
                  gap: "8px",
                  overflowX: "auto",
                  px: "8px",
                  mt: "8px",
                  justifyContent: "center",
                }}
              >
                {flat.imgUpload.map((photo, index) => {
                  return (
                    <Box
                      key={photo}
                      sx={{
                        ":hover": {
                          opacity: 0.8,
                          filter: "brightness(80%)",
                        },
                      }}
                    >
                      <img
                        src={photo}
                        alt={`Miniatura-${photo}`}
                        onClick={() => handleThumbnailClick(index)}
                        style={{
                          width: "80px",
                          minWidth: "80px",
                          height: "60px",
                          objectFit: "cover",
                          borderRadius: "4px",
                          cursor: "pointer",
                          transition: "all 0.3s ease-in-out",
                          opacity: currentImageIndex === index ? 1 : 0.6,
                          border:
                            currentImageIndex === index
                              ? `2px solid ${colors.heroSecondaryButtonBorderHover}`
                              : "2px solid transparent",
                          filter:
                            currentImageIndex === index
                              ? "none"
                              : "brightness(60%)",
                        }}
                      />
                    </Box>
                  );
                })}
              </Box>
            </>
          ) : (
            <Typography
              variant="body1"
              color="textSecondary"
              sx={{ textAlign: "center", pt: 15 }}
            >
              No hay imágenes disponibles.
            </Typography>
          )}
        </Box>

        {flatDetails.map((item, index) => (
          <FlatViewItem
            key={index}
            id={item.id}
            label={item.label}
            value={item.value}
            flatUid={flat.uid}
            uid={user?.uid}
            flatId={flat.id}
          />
        ))}
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
