export interface IUser {
  _id: string;
  fullname: string;
  photo?: string;
  email: string;
  username: string;
  groups?: string[];
  password: string;
  isVerified: boolean;
}
