import { Moment } from 'moment';

export interface FlatData {
  id: string;
  flatName: string;
  city: string;
  street: string;
  streetNumber: string;
  area: number;
  airConditioning: string;
  yearBuilt: number;
  dateAvailable: Moment;
  rentPrice: number;
  imgUpload: string[];
  isFavorite: boolean;
  createdAt: Moment;
  uid: string;
}

export type FilterType = "select" | "slider";

export interface FilterConfig {
  label: string;
  options?: string[];
  type: FilterType;
  id: string;
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number[];
}

export type SortOrder = 'asc' | 'desc' | null;

export interface CurrentSort {
  field: keyof FlatData | null;
  order: SortOrder;
}

export interface AllFlatsStrings {
  emptyLabel: string;
  searchBar: {
    placeholder: string;
    icon: string;
    type: string;
    id: string;
  };
  toggleButton: {
    tableIconTooltip: string;
    tableIconOn: string;
    tableIconOff: string;
    tableIconAlt: string;
    gridIconTooltip: string;
    gridIconOn: string;
    gridIconOff: string;
    gridIconAlt: string;
  };
  favoriteButton: {
    tooltip: string;
    favoriteIconOn: string;
    favoriteIconOff: string;
    favoriteIconAlt: string;
  };
  filter: {
    iconSrc: string;
    iconAlt: string;
    label: string;
    filters: FilterConfig[];
  };
  sort: {
    label: string;
    type: string;
    id: string;
    options: string[];
  };
  labels: {
    city: string;
    address: string;
    area: string;
    airConditioning: string;
    yearBuilt: string;
    dateAvailable: string;
    rentPrice: string;
    createdAt: string;
  };
  options: {
    yes: string;
    no: string;
  };
  imgAlt: string;
  favorite: {
    tooltip: string;
    favoriteIcon: string;
    unfavoriteIcon: string;
    alt: string;
  };
  tableHead: string[];
  allFlatsFiltered: FlatData[];
  searchOn: boolean;
  newFlat: string;
  filtersOn: {
    cityOn: boolean;
    priceOn: boolean;
    areaOn: boolean;
  };
}