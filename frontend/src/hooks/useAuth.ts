import { UserRole } from "@/api/endpoints/auth/types";
import { RootState } from "@/store";
import { useSelector } from "react-redux";

export const useAuth = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  if (!user) {
    return {
      user: null,
      isAuthenticated: false,
      isStudent: false,
      isProfessor: false,
      isAdmin: false
    };
  }

  return {
    user,
    isAuthenticated: !!user,
    isStudent: user?.role === UserRole.Student,
    isProfessor: user?.role === UserRole.Professor,
    isAdmin: user?.role === UserRole.Admin,
  };
};
