export type UserRole = "admin" | "employee";

export interface IUser {
  _id: string;
  email: string;
  role: UserRole;
  name?: string;
  photo?: string;
}
