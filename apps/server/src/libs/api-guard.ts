import { FastifyRequest, FastifyReply } from "fastify";
import * as jose from "jose";

export const apiGuard = async (req: FastifyRequest, reply: FastifyReply) => {
  const token = req.headers["x-setutu-api-token"] as string;

  if (!token || !process.env.API_JWT_SECRET) {
    reply.send({
      code: 200,
      data: null,
      message: "Success",
    });
    return;
  }

  try {
    const secret = new TextEncoder().encode(process.env.API_JWT_SECRET);
    await jose.jwtVerify(token, secret);
  } catch (error) {
    reply.send({
      code: 200,
      data: null,
      message: "Success",
    });
    return;
  }
};
