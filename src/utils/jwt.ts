export interface JwtPayload {
  sub?: string;
  id?: number;
  email?: string;
  name?: string;
  role?: string;
  exp?: number;
}

export function decodeJwt<T = JwtPayload>(token: string): T {
  const base64Payload = token.split(".")[1];
  const payload = window.atob(base64Payload);
  return JSON.parse(payload);
}
