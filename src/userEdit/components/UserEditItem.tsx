import React, { useEffect, useState } from "react";
import {
  Typography,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
  TextField,
  Box,
} from "@mui/material";
import { colors } from "../../strings/colors";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { useUpdateDocument } from "../../hooks/useUpdateDocument";
import type { Moment } from "moment";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import { signupStrings } from "../../auth/signup/strings/signupStrings";

interface ProfileDetailItemProps {
  id: string;
  profileId: string;
  editable: boolean;
  label: string;
  type: string;
  value: string | number | Moment | null | undefined;
  onUpdateSuccess?: () => void;
}

export const UserEditItem: React.FC<ProfileDetailItemProps> = ({
  id,
  label,
  type,
  value,
  profileId,
  editable,
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

  useEffect(() => {
    if (!isEditing) {
      setEditedValue(value);
    }
  }, [isEditing, value]);

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
    await updateDocument("users", profileId, dataToUpdate);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
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
          {type === "date" ? (
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DatePicker
                label={label}
                value={moment.isMoment(editedValue) ? editedValue : null}
                minDate={signupStrings.left[2].min}
                maxDate={signupStrings.left[2].max}
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
                setEditedValue(type === "number" ? Number(val) : val);
              }}
              type={type === "number" ? "number" : type}
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
      {editable && !isEditing ? (
        <IconButton onClick={() => setIsEditing(true)}>
          <EditIcon sx={{ color: colors.titleColor, height: "20px" }} />
        </IconButton>
      ) : (
        <></>
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
