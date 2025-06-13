export type LoginInputType = "email" | "password";

export interface LoginFieldConfig {
  label: string;
  placeholder: string;
  type: LoginInputType;
  id: string;
  validation?: string[];
}

export interface LoginStrings {
  imageUrl: string;
  title: string;
  email: LoginFieldConfig;
  password: LoginFieldConfig;
  primaryButton: string;
  secondaryButton: string;
  registerLinkText: string;
}

export type LoginFormState = {
  [key: string]: string;
};

export type LoginFormErrors = {
  [key: string]: string;
};
