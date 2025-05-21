import { FastifyRequest, FastifyReply } from "fastify";
import * as jose from "jose";

export const apiGuard = async (req: FastifyRequest, res: FastifyReply) => {
  const token = req.headers["x-setutu-api-token"] as string;

  if (!token || !process.env.API_JWT_SECRET) {
    res.send({
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
    res.send({
      code: 200,
      data: null,
      message: "Success",
    });
    return;
  }
};
