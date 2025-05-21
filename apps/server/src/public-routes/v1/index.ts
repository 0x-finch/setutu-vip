import { FastifyInstance, FastifyPluginOptions } from "fastify";

export const routes = async (
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) => {
  fastify.post("/sign-in", async (req, res) => {
    const { email, password } = req.body as {
      email: string;
      password: string;
    };
  });
};
