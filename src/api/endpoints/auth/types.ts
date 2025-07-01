export enum UserRole {
    Student = "Student",
    Professor = "Professor",
    Admin = "Admin"
};

export interface IReg {
    firstName: string,
    lastName: string,
    email: string,
    password: string
}

export interface ILogin {
    email: string,
    password: string
}

type IRegWithoutPassword = Omit<IReg, "password">
export type IAuthResponse = IRegWithoutPassword & { userId: string, role: UserRole }

