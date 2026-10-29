export interface JwtClaims {
  exp?: number;
  sub?: string;
  email?: string;
  name?: string;
  roles?: string | string[];
}

export interface LoginRequest {
  userName: string;
  password: string;
}
