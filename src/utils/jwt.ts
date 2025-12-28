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

export function getUserIdFromToken(): string | null {
  const token = localStorage.getItem("accessToken");
  if (!token) return null;

  try {
    const payloadBase64 = token.split(".")[1];
    const payload = JSON.parse(atob(payloadBase64));
    return payload.id || null;
  } catch (error) {
    console.error("Failed to decode token", error);
    return null;
  }
}
