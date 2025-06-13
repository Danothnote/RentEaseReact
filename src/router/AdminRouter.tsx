import { useContext, type ReactNode } from "react";
import { AuthContext } from "../auth/context/AuthContext";
import { Navigate } from "react-router";

interface AdminRouterProps {
  children: ReactNode;
}

export const AdminRouter: React.FC<AdminRouterProps> = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user?.role === "admin" ? children : <Navigate to={"/"} />;
};
