export interface IUser {
  first_name: string;
  last_name: string;
  email: string;
  password:string;
  mobile_no: number;
  role: string;
  profile_img?: string | null; // nullable
}