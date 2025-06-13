import type { Moment } from "moment";
import type { NavigateFunction } from "react-router";

export interface AuthUser {
  uid: string;
  username: string;
  firstName: string;
  lastName: string;
  birthday: Moment | null;
  email: string | null;
  password?: string;
  profilePicture: string;
  flats: [];
  role: string;
  createdAt: Moment | null;
}

export interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (
    email: string,
    password: string,
    navigate: NavigateFunction
  ) => Promise<void>;
  logout: () => Promise<void>;
  passwordReset: () => Promise<void>;
  register: (
    username: string,
    firstName: string,
    lastName: string,
    birthday: Moment,
    email: string,
    password: string,
    navigate: NavigateFunction
  ) => Promise<void>;
  deleteAccount: () => Promise<void>;
}
