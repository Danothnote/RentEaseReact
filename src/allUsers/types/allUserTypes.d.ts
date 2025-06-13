import { Moment } from "moment";
import type { AuthUser } from "../../auth/types/authTypes";

export type SortOrder = "asc" | "desc" | null;

export interface CurrentSort {
  field: keyof AuthUser | null;
  order: SortOrder;
}

export interface AllUserStrings {
  emptyLabel: string;
  allUsersTitle: string;
  searchBar: {
    placeholder: string;
    icon: string;
    type: string;
    id: string;
  };
  labels: {
    uid: string;
    username: string;
    firstName: string;
    lastName: string;
    birthday: string;
    email: string;
    profilePicture: string;
    flats: string;
    role: string;
    createdAt: string;
  };
  imgAlt: string;
  tableHead: string[];
  searchOn: boolean;
}
