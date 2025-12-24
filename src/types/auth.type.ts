export interface SignupDto {
  username?: string;
  email: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}
