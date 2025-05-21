import { FastifyInstance, FastifyPluginOptions } from "fastify";

export const routes = async (
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) => {
  fastify.addHook("preHandler", options.preHandler.apiGuard);

  fastify.get("/images", async (req, res) => {
    res.send({
      message: "Hello World",
    });
  });
};
