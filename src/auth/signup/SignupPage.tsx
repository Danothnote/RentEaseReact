import { useContext, useEffect, useMemo, useState } from "react";
import { signupStrings } from "./strings/signupStrings";
import { Box, Button, Grid, Paper, TextField, Typography } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import type { Moment } from "moment";
import { colors } from "../../strings/colors";
import type { FieldConfig, FormErrors, FormState } from "./types/signupTypes";
import { validatePassword } from "./helpers/validatePassword";
import { useNavigate } from "react-router";
import { AuthContext } from "../context/AuthContext";

export const SignupPage = () => {
  // Inicializa el estado del formulario
  const initialFormState = useMemo(() => {
    const state: FormState = {};
    state[signupStrings.username.id] = "";
    signupStrings.left.forEach((field) => {
      state[field.id] = field.type === "date" ? null : "";
    });
    signupStrings.right.forEach((field) => {
      state[field.id] = "";
    });
    return state;
  }, []);

  const [formData, setFormData] = useState<FormState>(initialFormState);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const { register } = useContext(AuthContext);

  const navigate = useNavigate();

  const onNavigate = () => {
    navigate("/login");
  };

  // Función para manejar el cambio en los inputs
  const handleChange = (id: string, value: string | Moment | null) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Ejecuta validaciones cada vez que cambian los campos relevantes
  useEffect(() => {
    const newErrors: FormErrors = {};

    const allFieldsToValidate: FieldConfig[] = [
      signupStrings.username,
      ...signupStrings.left,
      ...signupStrings.right,
    ];

    let hasEmptyFields = false;

    allFieldsToValidate.forEach((field) => {
      const value = formData[field.id];

      // Validar si el campo está vacío
      if (field.type === "date") {
        const birthdayMoment = value as Moment | null;
        if (!birthdayMoment || !birthdayMoment.isValid()) {
          newErrors[field.id] =
            field.validation?.[0] ||
            "La fecha de nacimiento es requerida y válida.";
          hasEmptyFields = true;
        } else if (field.max && birthdayMoment.isAfter(field.max)) {
          newErrors[field.id] =
            field.validation?.[0] || "Debes ser mayor de 18 años.";
        } else if (field.min && birthdayMoment.isBefore(field.min)) {
          newErrors[field.id] =
            field.validation?.[0] || "La fecha es demasiado antigua.";
        }
      } else {
        const stringValue = String(value || "").trim();
        if (stringValue.length === 0) {
          hasEmptyFields = true;
        } else {
          if (field.id === "email") {
            if (
              !/^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/.test(
                stringValue
              )
            ) {
              newErrors[field.id] =
                field.validation?.[0] || "Debe ser un email válido.";
            }
          } else if (field.id === "password") {
            const pErrors = validatePassword(stringValue);
            if (pErrors.length > 0) {
              newErrors[field.id] = pErrors;
            }
          } else if (field.id === "confirmPassword") {
            const passwordValue = (formData.password as string) || "";
            if (passwordValue !== stringValue) {
              newErrors[field.id] = "Las contraseñas no coinciden.";
            }
          } else if (
            field.validation &&
            field.validation.length > 0 &&
            stringValue.length < 2
          ) {
            newErrors[field.id] = field.validation[0];
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
      register(
        formData.userName as string,
        formData.firstName as string,
        formData.lastName as string,
        formData.birthday as Moment,
        formData.email as string,
        formData.password as string,
        navigate
      );
    } else {
      console.log(
        "Errores en el formulario de registro al intentar enviar:",
        formErrors
      );
    }
  };

  const renderTextField = (field: FieldConfig) => {
    const errorText = formErrors[field.id];
    const isError =
      !!errorText && (Array.isArray(errorText) ? errorText.length > 0 : true);

    if (field.type === "date") {
      return (
        <LocalizationProvider dateAdapter={AdapterMoment} key={field.id}>
          <DatePicker
            label={field.label}
            value={formData[field.id] as Moment | null}
            onChange={(newValue: Moment | null) =>
              handleChange(field.id, newValue)
            }
            minDate={field.min}
            maxDate={field.max}
            sx={{
              width: "250px",
              mx: 2,
              my: 2,
              "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                {
                  borderColor: colors.titleColor,
                },
              "& .MuiInputLabel-root.Mui-focused": {
                color: colors.titleColor,
              },
            }}
          />
        </LocalizationProvider>
      );
    }

    return (
      <TextField
        key={field.id}
        label={field.label}
        type={field.type as "text" | "email" | "password"}
        placeholder={field.placeholder}
        variant="outlined"
        margin="normal"
        value={formData[field.id] || ""}
        sx={{
          width: "250px",
          mx: 2,
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
        helperText={Array.isArray(errorText) ? errorText.join(", ") : errorText}
      />
    );
  };

  return (
    <Box
      sx={{
        py: 8,
        px: 2,
        backgroundImage: `url(${signupStrings.imageUrl})`,
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
          {signupStrings.title}
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ width: "100%", px: { xs: 0, sm: 2 } }}
        >
          {renderTextField(signupStrings.username)}
          <Grid container spacing={2} sx={{ justifyContent: "center" }}>
            <Grid
              sx={{ xs: 12, sm: 6, display: "flex", flexDirection: "column" }}
            >
              {signupStrings.left.map((field) => renderTextField(field))}
            </Grid>

            <Grid
              sx={{ xs: 12, sm: 6, display: "flex", flexDirection: "column" }}
            >
              {signupStrings.right.map((field) => renderTextField(field))}
            </Grid>
          </Grid>

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
              {signupStrings.primaryButton}
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
              onClick={onNavigate}
            >
              {signupStrings.secondaryButton}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};
