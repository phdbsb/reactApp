import { IAuthResponse, UserRole } from "../auth/types";

export type UserDisplay = IAuthResponse;

export type UserRoleUpdate = Record<string, UserRole>;