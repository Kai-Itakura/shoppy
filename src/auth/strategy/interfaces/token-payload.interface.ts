export interface TokenPayload {
  userId: number;
}

export interface JwtPayload {
  userId: number;
  iat: number;
  exp: number;
}
