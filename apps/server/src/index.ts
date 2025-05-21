import Fastify from "fastify";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { pgClient } from "./plugins/pg-client";
import { routes as publicRoutesV1 } from "./public-routes/v1";
import { routes as protectedRoutesV1 } from "./protected-routes/v1";
import cors from "@fastify/cors";
import { bearerTokenGuard } from "./libs/bearer-token-guard";

const fastify = Fastify({
  logger: true,
}).withTypeProvider<TypeBoxTypeProvider>();

fastify.register(cors, {
  origin: "*",
});

fastify.register(pgClient);

fastify.get("/", async (req, res) => {
  res.send("Hello World!");
});

fastify.register(publicRoutesV1, { prefix: "/v1/public" });
fastify.register(protectedRoutesV1, {
  prefix: "/v1/protected",
  preHandler: {
    bearerTokenGuard,
  },
});

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
