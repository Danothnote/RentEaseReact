import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useContext, useEffect, useMemo, useState } from "react";
import { loginStrings } from "./strings/loginStrings";
import { colors } from "../../strings/colors";
import type {
  LoginFieldConfig,
  LoginFormErrors,
  LoginFormState,
} from "./types/loginTypes";
import { AuthContext } from "../../auth/context/AuthContext";
import { useNavigate } from "react-router";

export const LoginPage = () => {
  // Inicializa el estado del formulario
  const initialFormState = useMemo(() => {
    const state: LoginFormState = {};
    state[loginStrings.email.id] = "";
    state[loginStrings.password.id] = "";
    return state;
  }, []);

  const [formData, setFormData] = useState<LoginFormState>(initialFormState);
  const [formErrors, setFormErrors] = useState<LoginFormErrors>({});
  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const onNavigate = () => {
    navigate("/signup");
  };

  // Función para manejar el cambio en los inputs
  const handleChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  useEffect(() => {
    const newErrors: LoginFormErrors = {};
    let hasEmptyFields = false;

    // Validar Nombre de Usuario/Email
    const emailField = loginStrings.email;
    const emailValue = formData[emailField.id].trim();
    if (!/^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/.test(emailValue)) {
      hasEmptyFields = true;
    }

    // Validar Contraseña
    const passwordField = loginStrings.password;
    const passwordValue = formData[passwordField.id].trim();
    if (passwordValue.length === 0) {
      hasEmptyFields = true;
    }

    setFormErrors(newErrors);
    setIsFormValid(!hasEmptyFields && Object.keys(newErrors).length === 0);
  }, [formData]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isFormValid) {
      await login(formData.email, formData.password, navigate);
    } else {
      console.log("Errores en el formulario de login:", formErrors);
    }
  };

  // Función para renderizar un TextField de login
  const renderLoginTextField = (field: LoginFieldConfig) => {
    const errorText = formErrors[field.id];
    const isError = !!errorText;

    return (
      <TextField
        key={field.id}
        label={field.label}
        placeholder={field.placeholder}
        type={field.type}
        value={formData[field.id]}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handleChange(field.id, e.target.value)
        }
        error={isError}
        helperText={isError ? errorText : ""}
        required
        variant="outlined"
        fullWidth
        margin="normal"
        sx={{
          mb: 2,
          "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
            {
              borderColor: colors.titleColor,
            },
          "& .MuiInputLabel-root.Mui-focused": {
            color: colors.titleColor,
          },
        }}
      />
    );
  };

  return (
    <Box
      sx={{
        py: 8,
        px: 2,
        backgroundImage: `url(${loginStrings.imageUrl})`,
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
          p: 4,
          borderRadius: 2,
          width: { xs: "70%", sm: "400px" },
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
          {loginStrings.title}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
          {renderLoginTextField(loginStrings.email)}
          {renderLoginTextField(loginStrings.password)}
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
            {loginStrings.primaryButton}
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
            {loginStrings.secondaryButton}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};
