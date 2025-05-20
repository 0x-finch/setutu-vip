import Fastify from "fastify";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { pgClient } from "./plugins/pg-client";
import { routes as publicRoutes } from "./public-routes";

const fastify = Fastify({
  logger: true,
}).withTypeProvider<TypeBoxTypeProvider>();

fastify.register(pgClient);

fastify.get("/", async (req, res) => {
  res.send("Hello World!");
});

fastify.register(publicRoutes, { prefix: "/public" });

const start = async () => {
  try {
    const address = await fastify.listen({ port: 9000, host: "0.0.0.0" });
    fastify.log.info(`Server is running on ${address}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
