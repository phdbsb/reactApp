import { useDispatch } from "react-redux";
import { useLocation } from "react-router";
import { useGetCurrentUserQuery } from "./api/endpoints/auth";
import { useEffect } from "react";
import { setUser } from "./store/features/authSlice";
import { AppDispatch } from "./store";

export const AuthInitializer = () => {
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  const { data: user, isSuccess } = useGetCurrentUserQuery(undefined, {
    skip: isAuthPage,
  });

  useEffect(() => {
    if (isSuccess && user) {
      dispatch(setUser(user));
    }
  }, [isSuccess, user, dispatch]);

  return null;
};
