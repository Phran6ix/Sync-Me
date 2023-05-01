export interface IUser {
  _id: string;
  fullName: string;
  photo?: string;
  email: string;
  username: string;
  groups?: string[];
  password: string;
  isVerified: boolean;
}
