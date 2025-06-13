import React, { useEffect, useState } from "react";
import { Typography, IconButton, Snackbar, Alert, CircularProgress, TextField, Box } from "@mui/material";
import { colors } from "../../strings/colors";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { useUpdateDocument } from "../../hooks/useUpdateDocument";

interface FlatDetailItemProps {
  id: string;
  label: string;
  value: string | number | null | undefined;
  flatUid: string;
  uid?: string;
  flatId: string;
  onUpdateSuccess?: () => void;
}

export const FlatViewItem: React.FC<FlatDetailItemProps> = ({
  id,
  label,
  value,
  flatUid,
  uid,
  flatId,
  onUpdateSuccess,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedValue, setEditedValue] = useState(value);
  const { updateDocument, loading, error, success } = useUpdateDocument();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  // Sincronizar el estado de edición con el valor original cuando no está editando
  useEffect(() => {
    if (!isEditing) {
      setEditedValue(value);
    }
  }, [isEditing, value]);

  // Manejar el éxito o error de la actualización
  useEffect(() => {
    if (success) {
      setSnackbarMessage(`"${label}" actualizado exitosamente.`);
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setIsEditing(false);
      onUpdateSuccess?.();
    } else if (error) {
      setSnackbarMessage(error);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  }, [success, error, label, onUpdateSuccess]);

  const handleSave = async () => {
    if (editedValue === value) {
      setIsEditing(false);
      return;
    }

    const dataToUpdate = { [id]: editedValue };
    await updateDocument("flats", flatId, dataToUpdate);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const getTextFieldType = (fieldId: string) => {
    switch (fieldId) {
      case "area":
      case "yearBuilt":
      case "rentPrice":
        return "number";
      case "dateAvailable":
        return "date";
      default:
        return "text";
    }
  };

  return (
    <Box
      sx={{
        mb: 1,
        mx: 2,
        color: colors.titleColor,
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <Typography
        variant={id === "rentPrice" ? "h5" : "body1"}
        sx={{ fontWeight: "bold", mr: 1 }}
      >
        {label}
      </Typography>

      {isEditing ? (
        <Box
          sx={{ display: "flex", alignItems: "center", flexGrow: 1, gap: 1 }}
        >
          <TextField
            size="small"
            value={editedValue}
            onChange={(e) => {
              const newValue = e.target.value;
              if (getTextFieldType(id) === "number") {
                setEditedValue(Number(newValue));
              } else if (getTextFieldType(id) === "date") {
                setEditedValue(newValue);
              } else {
                setEditedValue(newValue);
              }
            }}
            type={getTextFieldType(id)}
            sx={{ flexGrow: 1 }}
          />
          <IconButton onClick={handleSave} disabled={loading}>
            {loading ? (
              <CircularProgress size={20} />
            ) : (
              <CheckIcon color="success" />
            )}
          </IconButton>
          <IconButton onClick={() => setIsEditing(false)} disabled={loading}>
            <CloseIcon color="error" />
          </IconButton>
        </Box>
      ) : (
        <Typography
          variant={id === "rentPrice" ? "h5" : "body1"}
          sx={{ color: colors.titleColor, flexGrow: 1 }}
        >
          {String(value)}
        </Typography>
      )}

      {uid === flatUid && !isEditing && (
        <IconButton onClick={() => setIsEditing(true)}>
          <EditIcon sx={{ color: colors.titleColor, height: "20px" }} />
        </IconButton>
      )}

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
