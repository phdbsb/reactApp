import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";

type Props = {
  children: React.ReactNode;
};

const RequireAdmin = ({ children }: Props) => {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default RequireAdmin;
