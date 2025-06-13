import { Moment } from "moment";

export type AirConditioningType = "Si" | "No" | "";

export interface NewFlatFormData {
  imgUpload: File[];
  area: number;
  yearBuilt: string;
  dateAvailable: Moment | null;
  flatName: string;
  city: string;
  street: string;
  streetNumber: string;
  airConditioning: AirConditioningType;
  rentPrice: number;
}

export interface NewFlatFieldConfig {
  label: string;
  placeholder?: string;
  id: keyof NewFlatFormData;
  type: NewFlatInputType;
  options?: string[];
  validation?: string[];
  min?: number | Moment;
  max?: number | Moment;
  labelMobile?: string;
  uploadButtonLabel?: string;
  alt?: string;
}

export interface NewFlatStrings {
  title: string;
  imageUrl: string;
  left: NewFlatFieldConfig[];
  right: NewFlatFieldConfig[];
  primaryButton: string;
  secondaryButton: string;
  dropImgLabel: string;
  dropImgIconSrc: string;
  dropImgIconAlt: string;
  uploadButtonLabel: string;
  uploadButtonID: string;
  noFileSelected: string;
}

export type NewFlatFormErrors = {
  [key: string]: string | string[];
};
