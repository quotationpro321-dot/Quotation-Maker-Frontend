/** Shape of `data` in the JSON body for `POST /auth/login`. */
export interface ILoginResponseUser {
  _id?: string;
  id?: string;
  email?: string;
  role?: string;
  name?: string;
  profilePhotoUrl?: string;
  userId?: string;
}

export interface ILoginResponseData {
  role?: string;
  user?: ILoginResponseUser | null;
}
