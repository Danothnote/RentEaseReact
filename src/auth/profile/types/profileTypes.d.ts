import moment, { Moment } from "moment";

export interface UserProfileData {
  userName: string;
  firstName: string;
  lastName: string;
  birthday: Moment | null;
  email: string;
}

export interface ProfileFieldConfig {
  label?: string;
  placeholder?: string;
  type?: string;
  min?: Moment;
  max?: Moment;
  src?: string;
  alt?: string;
  id?: string;
  valid?: boolean;
  editable?: boolean;
}

// Interfaz para el archivo de strings del perfil
export interface ProfileStrings {
  title: string;
  imageUrl: string,
  dialogTitle: string;
  dialogImgTitle: string;
  userImg: ProfileFieldConfig;
  editIcon: ProfileFieldConfig;
  textValidation: string[];
  dateValidation: string[];
  right: ProfileFieldConfig[];
  primaryButton: string;
  secondaryButton: string;
  dialogPrimaryButton: string;
  dialogSecundaryButton: string;
}
