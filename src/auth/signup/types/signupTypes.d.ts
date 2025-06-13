import type { Moment } from "moment";
import { Moment } from "moment";

export type InputType = "text" | "email" | "password" | "date";

export interface FieldConfig {
  label: string;
  placeholder: string;
  type: InputType;
  id: string;
  valid?: boolean;
  validation?: string[];
  min?: Moment;
  max?: Moment;
}

export interface SignupStrings {
  title: string;
  imageUrl: string;
  username: FieldConfig;
  left: FieldConfig[];
  right: FieldConfig[];
  primaryButton: string;
  secondaryButton: string;
}

// Para el estado del formulario
export type FormState = {
  [key: string]: string | Moment | null;
};

// Para los errores de campo
export type FormErrors = {
  [key: string]: string | string[];
};
