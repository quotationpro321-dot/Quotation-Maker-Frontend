import { IUser } from "@/types/user.type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IAuthInitialState {
  user: IUser | null;
  isLoggedIn: boolean;
}

const initialState: IAuthInitialState = {
  user: null,
  isLoggedIn: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload;
      state.isLoggedIn = true;
    },
    clearUser: (state) => {
      state.user = null;
      state.isLoggedIn = false;
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
