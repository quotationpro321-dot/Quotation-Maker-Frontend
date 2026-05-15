export type TBulkDeleteUsersResult = {
  deleted: string[];
  failed: { id: string; message: string }[];
};
