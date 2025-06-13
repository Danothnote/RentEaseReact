import type { LoginStrings } from "../types/loginTypes";

export const loginStrings: LoginStrings = {
    imageUrl: "src/assets/login.webp",
    title: "Inicio de Sesión",
    email: {
        label: "Correo Electrónico",
        placeholder: "Ej: usuario@email.com",
        type: "email",
        id: "email",
        validation: ["Requerido"],
    },
    password:{
        label: "Contraseña",
        placeholder: "Ej: Contraseña1*",
        type: "password",
        id: "password",
        validation: ["Requerida"],
    },
    primaryButton: "Iniciar Sesión",
    secondaryButton: "Registrarse",
    registerLinkText: "¿No tienes una cuenta? Regístrate aquí",
}