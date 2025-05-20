import { FastifyInstance, FastifyPluginOptions } from "fastify";

export const routes = async (
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) => {
  console.log("options", options);
};
