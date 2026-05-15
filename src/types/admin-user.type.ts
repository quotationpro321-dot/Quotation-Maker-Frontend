export type TUserRole = "admin" | "employee";

export type TUserStatus = "active" | "inactive" | "blocked" | "banned" | "deleted";

export type TAdminUser = {
  _id: string;
  userId: string;
  name: string;
  email: string;
  role: TUserRole;
  status: TUserStatus;
  profilePhotoUrl: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export type TAdminUsersPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type TAdminUsersListData = {
  items: TAdminUser[];
  pagination: TAdminUsersPagination;
};

export type TListAdminUsersParams = {
  page?: number;
  limit?: number;
  search?: string;
  role?: TUserRole;
  status?: TUserStatus;
  sortBy?: "name" | "email" | "role" | "status" | "createdAt";
  sortOrder?: "asc" | "desc";
};

export type TCreateAdminUserPayload = {
  name: string;
  email: string;
  password: string;
  role: TUserRole;
  status: TUserStatus;
};

/** Create response when email belonged to a previously removed user. */
export type TAdminUserCreateData = TAdminUser & {
  restored?: boolean;
};

export type TUpdateAdminUserPayload = {
  name?: string;
  email?: string;
  role?: TUserRole;
  status?: TUserStatus;
  password?: string;
};
