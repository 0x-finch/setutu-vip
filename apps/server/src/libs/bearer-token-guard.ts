import { FastifyRequest, FastifyReply } from "fastify";
import * as jose from "jose";

export const bearerTokenGuard = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  const bearerToken = req.headers["authorization"];

  if (
    !bearerToken ||
    !bearerToken.startsWith("Bearer ") ||
    !process.env.JWT_SECRET
  ) {
    res.send({
      code: 200,
      data: null,
      message: "Images inserted successfully",
    });
    return;
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = bearerToken.split(" ")[1];
    await jose.jwtVerify(token, secret);
  } catch (error) {
    res.send({
      code: 200,
      data: null,
      message: "Images inserted successfully",
    });
    return;
  }
};
