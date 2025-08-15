import { IAuthResponse, IReg, UserRole } from "../auth/types";

export type UserDisplay = IAuthResponse;

export type UserIdImage = {userId: string, imageData: string};

export type UserRoleUpdate = Record<string, UserRole>;

export type UserInfoUpdate = Omit<IReg, "email" | "password">