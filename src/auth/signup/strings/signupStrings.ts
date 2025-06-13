import { substractYears } from "../helpers/substractYears";
import type { SignupStrings } from "../types/signupTypes";

export const signupStrings: SignupStrings = {
  title: "Registro",
  imageUrl: "src/assets/registro.webp",
  username: {
    label: "Nombre de Usuario",
    placeholder: "Ej: usuario1",
    type: "text",
    id: "userName",
    valid: false,
    validation: ["Debe tener al menos 2 caracteres"],
  },
  left: [
    {
      label: "Nombre",
      placeholder: "Ej: Juan",
      type: "text",
      id: "firstName",
      valid: false,
      validation: ["Debe tener al menos 2 caracteres"],
    },
    {
      label: "Apellido",
      placeholder: "Ej: Castillo",
      type: "text",
      id: "lastName",
      valid: false,
      validation: ["Debe tener al menos 2 caracteres"],
    },
    {
      label: "Fecha de nacimiento",
      placeholder: "Ej: 1990-01-01",
      min: substractYears(120),
      max: substractYears(18),
      type: "date",
      id: "birthday",
      valid: false,
      validation: ["Debes ser mayor de 18 años"],
    },
  ],
  right: [
    {
      label: "Email",
      placeholder: "Ej: usuario@correo.com",
      type: "email",
      id: "email",
      valid: false,
      validation: ["Debe ser un email válido"],
    },
    {
      label: "Contraseña",
      placeholder: "Ej: Contraseña1*",
      type: "password",
      id: "password",
      valid: false,
    },
    {
      label: "Confirmar contraseña",
      placeholder: "Ej: Contraseña1*",
      type: "password",
      id: "confirmPassword",
      valid: false,
    },
  ],
  primaryButton: "Registrarse",
  secondaryButton: "Cancelar",
};
