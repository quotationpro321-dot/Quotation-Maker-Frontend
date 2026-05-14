export type UserRole = "admin" | "employee";

export interface IUser {
  _id: string;
  email: string;
  role: UserRole;
  name?: string;
  photo?: string;
  /** Business `userId` from Mongo (e.g. seeded admin string), shown read-only in settings. */
  accountCode?: string;
}
