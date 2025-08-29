import { IAuthResponse, IReg, UserRole } from "../auth/types";

export type UserDisplay = IAuthResponse;

export type UserIdImage = { userId: string; imagePath: string };

export type UserRoleUpdate = Record<string, UserRole>;

export type UserInfoUpdate = Omit<IReg, "email" | "password">;

type IAuthResponseWithoutRoleImagePath = Omit<IAuthResponse, "role" | "imagePath">;

export type StudentRegistration = IAuthResponseWithoutRoleImagePath & {grade: number | null, imagePath: string};
