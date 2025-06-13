import type { AllUserStrings } from "../types/allUserTypes";

export const allUserStrings: AllUserStrings = {
  emptyLabel: "No se ha agregado ningún elemento",
  allUsersTitle: "Administración de Usuarios",
  searchBar: {
    placeholder: "Buscar",
    icon: "src/assets/searchIcon.webp",
    type: "searchBar",
    id: "searchBar",
  },
  labels: {
    uid: "UID: ",
    username: "Nombre de usuario: ",
    firstName: "Nombre: ",
    lastName: "Apellido: ",
    birthday: "Fecha de nacimiento: ",
    email: "Email: ",
    profilePicture: "Foto de Perfil",
    flats: "Publicaciones: ",
    role: "Role: ",
    createdAt: "Creado: ",
  },
  tableHead: [
    "UID",
    "Nombre de usuario",
    "Nombre",
    "Apellido",
    "Email",
    "Role",
    "Fecha de nacimiento",
    "Publicaciones",
    "Creado",
    "Foto de Perfil",
  ],
  imgAlt: "profileImage",
  searchOn: false,
};
