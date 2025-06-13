import { substractYears } from "../../signup/helpers/substractYears";
import type { ProfileStrings } from "../types/profileTypes";

export const profileStrings: ProfileStrings = {
    title: "Perfil de Usuario",
    imageUrl: "src/assets/perfil.webp",
    dialogTitle: "Coloque el nuevo valor para ",
    dialogImgTitle: "Actualice su foto de perfil",
    userImg: {
        type: "img",
        src: "src/assets/imageIcon.webp",
        alt: "userImg",
        id: "profileImg",
        valid: false,
    },
    editIcon: {
        src: "src/assets/editIcon.webp",
        alt: "changeIcon",
    },
    textValidation: ["Debe tener al menos 2 caracteres"],
    dateValidation: ["Debes ser mayor de 18 años"],
    right: [
        {
            label: "Nombre de usuario:",
            placeholder: "Ej: usuario1",
            type: "text",
            id: "username",
            editable: true,
        },
        {
            label: "Nombre:",
            placeholder: "Ej: Juan",
            type: "text",
            id: "firstName",
            editable: true,
        },
        {
            label: "Apellido:",
            placeholder: "Ej: Castillo",
            type: "text",
            id: "lastName",
            editable: true,
        },
        {
            label: "Fecha de nacimiento:",
            placeholder: "Ej: 1990-01-01",
            min: substractYears(120),
            max: substractYears(18),
            type: "date",
            id: "birthday",
            editable: true,
        },
        {
            label: "Email:",
            placeholder: "Ej: usuario@correo.com",
            type: "email",
            id: "email",
            editable: false,
        },
    ],
    primaryButton: "Restablecer Contraseña",
    secondaryButton: "Borrar Cuenta",
    dialogPrimaryButton: "Actualizar",
    dialogSecundaryButton: "Cancelar",
}