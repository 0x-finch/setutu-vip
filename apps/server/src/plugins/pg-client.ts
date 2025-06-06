import fastifyPlugin from "fastify-plugin";
import { FastifyInstance, FastifyPluginOptions } from "fastify";
import fastifyPostgres from "@fastify/postgres";

async function pgConn(fastify: FastifyInstance, options: FastifyPluginOptions) {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set in environment variables.");
  }

  await fastify.register(fastifyPostgres, {
    connectionString: process.env.DATABASE_URL,
  });
  fastify.log.info("Successfully connected to PostgreSQL.");
}

export const pgClient = fastifyPlugin(pgConn);
