export const validationStrings = {
    email: "Por favor ingrese un email válido",
    password: "Por favor ingrese una contraseña válida",
    confirmPassword: "Las contraseñas no coinciden",
    firstName: "Por favor ingrese un nombre válido",
    lastName: "Por favor ingrese un apellido válido",
    birthday: "Por favor seleccione una fecha de nacimiento válida",
    passwordValidations: [
        {
            label: "* La contraseña debe tener al menos 8 caracteres",
            id: "minLength",
        },
        {
            label: "* La contraseña debe contener al menos una letra mayúscula",
            id: "hasUppercase",
        },
        {
            label: "* La contraseña debe contener al menos una letra minúscula",
            id: "hasLowercase",
        },
        {
            label: "* La contraseña debe contener al menos un número",
            id: "hasNumber",
        },
        {
            label: "* La contraseña debe contener al menos un carácter especial",
            id: "hasSpecialChar",
        },
        {
            label: "* La contraseña no debe contener espacios",
            id: "hasSpaces",
        },
        {
            label: "* Contraseña y Confirmar contraseña deben ser iguales",
            id: "samePassword",
        }
    ]
}