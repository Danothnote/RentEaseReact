import { useContext, type ReactNode } from "react";
import { AuthContext } from "../auth/context/AuthContext";
import { Navigate } from "react-router";

interface PrivateRouterProps {
  children: ReactNode;
}

export const PrivateRouter: React.FC<PrivateRouterProps>  = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to={"/login"} />;
};
