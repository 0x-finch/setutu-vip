import * as jose from "jose";

export const signJwt = async (email: string, expiresIn: string = "30d") => {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const alg = "HS256";
  const token = await new jose.SignJWT({
    email,
  })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setIssuer("Setutu Server")
    .setExpirationTime(expiresIn)
    .sign(secret);

  return token;
};
