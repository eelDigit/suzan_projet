import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ roles }) => {
  const { user } = useAuth();
  // Vérifiez si l'utilisateur est connecté et récupérer son role
  // correspond bien au rôle requis pour accéder à la page

  const isAuthorized = user && roles.includes(user.role);

  // Si l'utilisateur n'a pas le bon rôle
  if (!isAuthorized) {
    // Rediriger l'utilisateur vers la page d'accueil
    return <Navigate to={"/"} replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
