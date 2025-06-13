import { useContext, useEffect, useMemo, useState } from "react";
import type {
  AirConditioningType,
  NewFlatFieldConfig,
  NewFlatFormData,
  NewFlatFormErrors,
} from "./types/newFlatTypes";
import type { Moment } from "moment";
import { newFlatStrings } from "./strings/newFlatStrings";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { colors } from "../strings/colors";
import CloseIcon from "@mui/icons-material/Close";
import { AuthContext } from "../auth/context/AuthContext";
import { useNavigate } from "react-router";
import { useNewFlat } from "./hooks/useNewFlat";

export const NewFlatPage = () => {
  const initialFormState: NewFlatFormData = useMemo(
    () => ({
      imgUpload: [],
      area: 0,
      yearBuilt: "",
      dateAvailable: null,
      flatName: "",
      city: "",
      street: "",
      streetNumber: "",
      airConditioning: "",
      rentPrice: 0,
    }),
    []
  );

  const [formData, setFormData] = useState<NewFlatFormData>(initialFormState);
  const [formErrors, setFormErrors] = useState<NewFlatFormErrors>({});
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const { user } = useContext(AuthContext);
  const { newFlat, loading, error, success } = useNewFlat();

  const navigate = useNavigate();

  // Drag & Drop state
  const [isDragging, setIsDragging] = useState(false);

  const handleChange = (
    id: keyof NewFlatFormData,
    value: string | Moment | File[] | null
  ) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      handleChange("imgUpload", [...formData.imgUpload, ...newFiles]);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    if (event.dataTransfer.files) {
      const newFiles = Array.from(event.dataTransfer.files);
      handleChange("imgUpload", [...formData.imgUpload, ...newFiles]);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDeletePhoto = (indexToDelete: number) => {
    setFormData((prev) => ({
      ...prev,
      imgUpload: prev.imgUpload.filter((_, index) => index !== indexToDelete),
    }));
  };

  // Lógica de validación principal
  useEffect(() => {
    const newErrors: NewFlatFormErrors = {};
    let hasEmptyFields = false;

    // --- Validar todos los campos definidos en newFlatStrings.left y newFlatStrings.right ---
    const allFieldsToValidate = [
      ...newFlatStrings.left,
      ...newFlatStrings.right,
    ];

    allFieldsToValidate.forEach((fieldConfig) => {
      const id = fieldConfig.id;
      const value = formData[id];

      if (fieldConfig.type === "img") {
        if (formData.imgUpload.length === 0) {
          hasEmptyFields = true;
        }
      } else if (fieldConfig.type === "date") {
        const dateMoment = value as Moment | null;
        if (!dateMoment || !dateMoment.isValid()) {
          hasEmptyFields = true;
        } else if (
          fieldConfig.min &&
          dateMoment.isBefore(fieldConfig.min as Moment, "day")
        ) {
          newErrors[id] =
            fieldConfig.validation?.[0] ||
            `La fecha ${fieldConfig.label.toLowerCase()} no puede ser anterior a la actual.`;
        }
      } else if (fieldConfig.type === "select") {
        const selectValue = value as string;
        if (selectValue === "" || selectValue === null) {
          hasEmptyFields = true;
        }
      } else {
        // 'text' o 'number' (manejados como texto en el input)
        const stringValue = String(value || "").trim();
        if (stringValue.length === 0) {
          hasEmptyFields = true;
        } else {
          // Validaciones específicas para 'number'
          if (fieldConfig.type === "number") {
            const numValue = parseFloat(stringValue);
            if (isNaN(numValue) || numValue <= 0) {
              newErrors[id] =
                fieldConfig.validation?.[0] ||
                `El campo ${fieldConfig.label.toLowerCase()} debe ser un número válido y positivo.`;
            } else {
              if (
                fieldConfig.min !== undefined &&
                numValue < (fieldConfig.min as number)
              ) {
                newErrors[id] =
                  fieldConfig.validation?.[0] ||
                  `Debe ser mayor o igual a ${fieldConfig.min}.`;
              }
              if (
                fieldConfig.max !== undefined &&
                numValue > (fieldConfig.max as number)
              ) {
                newErrors[id] =
                  fieldConfig.validation?.[0] ||
                  `Debe ser menor o igual a ${fieldConfig.max}.`;
              }
            }
          }
          // Validaciones de longitud mínima para campos de texto (ej. flatName, city, street, streetNumber)
          if (
            fieldConfig.type === "text" &&
            fieldConfig.validation &&
            fieldConfig.validation.length > 0 &&
            stringValue.length < 2
          ) {
            newErrors[id] = fieldConfig.validation[0];
          }
        }
      }
    });

    setFormErrors(newErrors);
    setIsFormValid(!hasEmptyFields && Object.keys(newErrors).length === 0);
  }, [formData]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isFormValid) {
      newFlat(
        user!!.uid,
        formData.imgUpload,
        formData.area,
        formData.yearBuilt,
        formData.dateAvailable!!,
        formData.flatName,
        formData.city,
        formData.street,
        formData.streetNumber,
        formData.airConditioning,
        formData.rentPrice,
        navigate
      );
    } else {
      console.log("Errores en el formulario de publicación:", formErrors);
    }
  };

  useEffect(() => {
    if (success) {
      navigate("/");
    } else if (error) {
      console.log(error);
    }
  }, [success, error]);

  const renderField = (field: NewFlatFieldConfig) => {
    const errorText = formErrors[field.id];
    const isError =
      !!errorText && (Array.isArray(errorText) ? errorText.length > 0 : true);

    switch (field.type) {
      case "text":
      case "number":
        return (
          <TextField
            key={field.id}
            label={field.label}
            placeholder={field.placeholder}
            variant="outlined"
            margin="normal"
            type={field.type}
            value={formData[field.id] || ""}
            sx={{
              width: "250px",
              my: 2,
              "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                {
                  borderColor: colors.titleColor,
                },
              "& .MuiInputLabel-root.Mui-focused": {
                color: colors.titleColor,
              },
            }}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChange(field.id, e.target.value)
            }
            required
            error={isError}
            helperText={
              Array.isArray(errorText) ? errorText.join(", ") : errorText
            }
          />
        );
      case "date":
        return (
          <LocalizationProvider dateAdapter={AdapterMoment} key={field.id}>
            <DatePicker
              label={field.label}
              value={formData[field.id] as Moment | null}
              sx={{
                width: "250px",
                my: 2,
                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                  {
                    borderColor: colors.titleColor,
                  },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: colors.titleColor,
                },
              }}
              onChange={(newValue: Moment | null) =>
                handleChange(field.id, newValue)
              }
              minDate={field.min as Moment}
              maxDate={field.max as Moment}
            />
          </LocalizationProvider>
        );
      case "select":
        return (
          <FormControl margin="normal" required key={field.id} error={isError}>
            <InputLabel id={`${field.id}-label`}>{field.label}</InputLabel>
            <Select
              labelId={`${field.id}-label`}
              id={field.id}
              value={formData[field.id] as string}
              label={field.label}
              sx={{
                width: "250px",
                textAlign: "left",
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: colors.titleColor,
                },
                "&.Mui-focused .MuiOutlinedInput-root": {
                  color: colors.titleColor,
                },
              }}
              onChange={(e) =>
                handleChange(field.id, e.target.value as AirConditioningType)
              }
            >
              {field.options?.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
            {isError && (
              <Typography
                variant="caption"
                color="error"
                sx={{ mt: 0.5, ml: 1.4 }}
              >
                {errorText}
              </Typography>
            )}
          </FormControl>
        );
      case "img":
        return null;
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        py: 8,
        px: 2,
        backgroundImage: `url(${newFlatStrings.imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "bottom",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        minHeight: "93vh",
        textAlign: "center",
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
      }}
    >
      <Paper
        elevation={6}
        sx={{
          py: 4,
          px: 2,
          borderRadius: 2,
          width: { xs: "70%" },
          maxWidth: "fit-content",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: colors.transparentWhite,
          zIndex: 2,
        }}
      >
        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          sx={{ mb: 3, fontWeight: "bold", color: colors.titleColor }}
        >
          {newFlatStrings.title}
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ width: "100%", px: { xs: 0, sm: 2 } }}
        >
          <Grid container spacing={2} sx={{ justifyContent: "center" }}>
            <Grid
              sx={{
                xs: 12,
                sm: 6,
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              {newFlatStrings.left.map((field) => {
                if (field.type === "img") {
                  return (
                    <Box key={field.id}>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: "bold",
                          mb: 1,
                          color: colors.titleColor,
                        }}
                      >
                        {field.label}
                      </Typography>
                      <Paper
                        variant="outlined"
                        sx={{
                          p: 3,
                          height: "60px",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          border: `2px dashed ${
                            isDragging ? colors.grey : colors.titleColor
                          }`,
                          backgroundColor: isDragging
                            ? "action.hover"
                            : "transparent",
                          cursor: "pointer",
                          transition:
                            "border-color 0.3s, background-color 0.3s",
                          ...(formErrors.imgUpload && {
                            borderColor: "error.main",
                          }),
                        }}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                      >
                        <img
                          src={newFlatStrings.dropImgIconSrc}
                          alt={newFlatStrings.dropImgIconAlt}
                          style={{
                            width: "30px",
                            height: "30px",
                          }}
                        />
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          sx={{ color: colors.titleColor, mt: 2 }}
                        >
                          {newFlatStrings.dropImgLabel}
                        </Typography>
                      </Paper>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ my: 2, color: colors.titleColor }}
                      >
                        {field.uploadButtonLabel}
                      </Typography>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        style={{ display: "none" }}
                        id="photo-upload-input"
                        onChange={handleFileChange}
                      />
                      <label htmlFor="photo-upload-input">
                        <Button
                          variant="outlined"
                          component="span"
                          sx={{
                            borderWidth: colors.secondaryButtonBorderWidth,
                            borderColor: colors.secondaryButtonBorderColor,
                            color: colors.secondaryButtonTextColor,
                            "&:hover": {
                              backgroundColor:
                                colors.secondaryButtonBackgroundHover,
                            },
                          }}
                        >
                          {newFlatStrings.uploadButtonLabel}
                        </Button>
                      </label>
                      {formErrors.imgUpload && (
                        <Typography
                          variant="caption"
                          color="error"
                          sx={{ mt: 0.5, ml: 1.4 }}
                        >
                          {formErrors.imgUpload}
                        </Typography>
                      )}
                      <Box
                        sx={{
                          mt: 2,
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 1,
                          maxWidth: "250px",
                        }}
                      >
                        {formData.imgUpload.length === 0 ? (
                          <Typography variant="body2" color="textSecondary">
                            {newFlatStrings.noFileSelected}
                          </Typography>
                        ) : (
                          formData.imgUpload.map((file, index) => (
                            <Chip
                              key={index}
                              label={file.name}
                              onDelete={() => handleDeletePhoto(index)}
                              deleteIcon={<CloseIcon />}
                              variant="outlined"
                              sx={{
                                color: colors.titleColor,
                                borderColor: colors.titleColor,
                              }}
                            />
                          ))
                        )}
                      </Box>
                    </Box>
                  );
                }
                return renderField(field);
              })}
            </Grid>

            <Grid
              sx={{
                xs: 12,
                sm: 6,
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              {newFlatStrings.right.map((field) => renderField(field))}
            </Grid>
          </Grid>

          <Box
            sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 4 }}
          >
            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{
                my: 2,
                mx: 2,
                color: colors.primaryButtonTextColor,
                backgroundColor: colors.primaryButtonBackground,
                "&:hover": {
                  backgroundColor: colors.primaryButtonHover,
                },
              }}
              disabled={!isFormValid}
            >
              {loading ? (
                <CircularProgress sx={{ color: colors.yellowText }} />
              ) : (
                newFlatStrings.primaryButton
              )}
            </Button>
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
              onClick={() => navigate(-1)}
            >
              {newFlatStrings.secondaryButton}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};
