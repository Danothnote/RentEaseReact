import React, { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  TextField,
  IconButton,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import type { Moment } from "moment";
import { useUpdateDocument } from "../../../hooks/useUpdateDocument";
import moment from "moment";
import { colors } from "../../../strings/colors";
import type { ProfileFieldConfig } from "../types/profileTypes";

interface ProfileFieldProps {
  field: ProfileFieldConfig;
  currentValue: string | number | Moment | null | undefined;
  userId: string;
  onUpdateSuccess?: (updatedFieldId: string, updatedValue: any) => void;
}

export const ProfileItem: React.FC<ProfileFieldProps> = ({
  field,
  currentValue,
  userId,
  onUpdateSuccess,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedValue, setEditedValue] = useState<
    string | number | Moment | null | undefined
  >(currentValue);
  const { updateDocument, loading, error, success } = useUpdateDocument();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  useEffect(() => {
    if (!isEditing) {
      setEditedValue(currentValue);
    }
  }, [isEditing, currentValue]);

  useEffect(() => {
    if (success) {
      setSnackbarMessage(`"${field.label}" actualizado exitosamente.`);
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setIsEditing(false);
      onUpdateSuccess?.(field.id!!, editedValue);
    } else if (error) {
      setSnackbarMessage(error);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  }, [success, error, field.label, onUpdateSuccess]);

  const handleSave = async () => {
    if (editedValue === currentValue) {
      setIsEditing(false);
      return;
    }

    const dataToUpdate: { [key: string]: any } = {};

    if (field.type === "date") {
      if (moment.isMoment(editedValue) && editedValue.isValid()) {
        dataToUpdate[field.id!!] = editedValue.toISOString();
      } else {
        setSnackbarMessage("Fecha inválida.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return;
      }
    } else {
      dataToUpdate[field.id!!] = editedValue;
    }

    await updateDocument("users", userId, dataToUpdate);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedValue(currentValue);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const displayValue = () => {
    if (field.type === "date" && moment.isMoment(currentValue)) {
      return currentValue.format("YYYY-MM-DD");
    }
    return String(currentValue || "N/A");
  };

  return (
    <Grid
      sx={{
        xs: 12,
        sm: 6,
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
      }}
      key={field.id}
    >
      <Typography
        variant="body1"
        sx={{ fontWeight: "bold", color: colors.titleColor, mr: 1 }}
      >
        {field.label}
      </Typography>

      {isEditing ? (
        <Box
          sx={{ display: "flex", alignItems: "center", flexGrow: 1, gap: 1 }}
        >
          {field.type === "date" ? (
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DatePicker
                label={field.label}
                value={moment.isMoment(editedValue) ? editedValue : null}
                minDate={field.min}
                maxDate={field.max}
                onChange={(newValue) => setEditedValue(newValue)}
                slotProps={{ textField: { size: "small", fullWidth: true } }}
              />
            </LocalizationProvider>
          ) : (
            <TextField
              size="small"
              value={editedValue}
              onChange={(e) => {
                const val = e.target.value;
                setEditedValue(field.type === "number" ? Number(val) : val);
              }}
              type={field.type === "number" ? "number" : field.type}
              sx={{ flexGrow: 1 }}
            />
          )}
          <IconButton onClick={handleSave} disabled={loading}>
            {loading ? (
              <CircularProgress size={20} />
            ) : (
              <CheckIcon color="success" />
            )}
          </IconButton>
          <IconButton onClick={handleCancel} disabled={loading}>
            <CloseIcon color="error" />
          </IconButton>
        </Box>
      ) : (
        <Typography variant="body1" sx={{ color: colors.titleColor }}>
          {displayValue()}
        </Typography>
      )}

      {field.editable && !isEditing && (
        <IconButton
          edge="start"
          color="inherit"
          onClick={() => setIsEditing(true)}
          sx={{ ml: 1, mb: 1 }}
        >
          <EditIcon sx={{ color: colors.titleColor }} />
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
    </Grid>
  );
};
