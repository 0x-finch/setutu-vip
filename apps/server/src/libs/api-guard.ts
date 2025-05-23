import { FastifyReply, FastifyRequest } from "fastify";
import * as jose from "jose";

export const apiGuard = async (req: FastifyRequest, reply: FastifyReply) => {
  const token = req.headers["x-setutu-api-token"] as string;

  if (!token || !process.env.API_JWT_SECRET) {
    reply.send({
      code: 200,
      data: null,
      message: "Success 1",
    });
    return;
  }

  try {
    const secret = new TextEncoder().encode(process.env.API_JWT_SECRET);
    const { payload } = await jose.jwtVerify(token, secret);

    req.api = {
      email: payload.email as string,
    };
  } catch (error) {
    reply.send({
      code: 200,
      data: null,
      message: "Success 2",
    });
    return;
  }
};
