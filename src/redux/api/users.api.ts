import { baseApi } from "@/redux/baseApi";
import type { IResponse } from "@/types";
import type { TBulkDeleteUsersResult } from "@/types/admin-user-bulk-delete.type";
import type {
  TAdminUser,
  TAdminUsersListData,
  TCreateAdminUserPayload,
  TListAdminUsersParams,
  TUpdateAdminUserPayload,
} from "@/types/admin-user.type";

const USERS_URL = "/users";

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listAdminUsers: builder.query<IResponse<TAdminUsersListData>, TListAdminUsersParams>({
      query: (params) => ({
        url: USERS_URL,
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result?.data.items
          ? [
              { type: "AdminUsers", id: "LIST" },
              ...result.data.items.map((u) => ({ type: "AdminUsers" as const, id: u._id })),
            ]
          : [{ type: "AdminUsers", id: "LIST" }],
    }),
    getAdminUser: builder.query<IResponse<TAdminUser>, string>({
      query: (id) => ({
        url: `${USERS_URL}/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _err, id) => [{ type: "AdminUsers", id }],
    }),
    createAdminUser: builder.mutation<IResponse<TAdminUser>, TCreateAdminUserPayload>({
      query: (body) => ({
        url: USERS_URL,
        method: "POST",
        data: body,
      }),
      invalidatesTags: [{ type: "AdminUsers", id: "LIST" }],
    }),
    updateAdminUser: builder.mutation<
      IResponse<TAdminUser>,
      { id: string; body: TUpdateAdminUserPayload }
    >({
      query: ({ id, body }) => ({
        url: `${USERS_URL}/${id}`,
        method: "PATCH",
        data: body,
      }),
      invalidatesTags: (_result, _err, { id }) => [
        { type: "AdminUsers", id: "LIST" },
        { type: "AdminUsers", id },
      ],
    }),
    bulkDeleteAdminUsers: builder.mutation<IResponse<TBulkDeleteUsersResult>, { ids: string[] }>({
      query: (body) => ({
        url: `${USERS_URL}/bulk-delete`,
        method: "POST",
        data: body,
      }),
      invalidatesTags: [{ type: "AdminUsers", id: "LIST" }],
    }),
    deleteAdminUser: builder.mutation<IResponse<{ _id: string }>, string>({
      query: (id) => ({
        url: `${USERS_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _err, id) => [
        { type: "AdminUsers", id: "LIST" },
        { type: "AdminUsers", id },
      ],
    }),
    uploadAdminUserAvatar: builder.mutation<
      IResponse<TAdminUser>,
      { id: string; file: File }
    >({
      query: ({ id, file }) => {
        const body = new FormData();
        body.append("avatar", file);
        return {
          url: `${USERS_URL}/${id}/avatar`,
          method: "POST",
          data: body,
        };
      },
      invalidatesTags: (_result, _err, { id }) => [
        { type: "AdminUsers", id: "LIST" },
        { type: "AdminUsers", id },
      ],
    }),
  }),
});

export const {
  useListAdminUsersQuery,
  useGetAdminUserQuery,
  useCreateAdminUserMutation,
  useUpdateAdminUserMutation,
  useDeleteAdminUserMutation,
  useBulkDeleteAdminUsersMutation,
  useUploadAdminUserAvatarMutation,
} = usersApi;
