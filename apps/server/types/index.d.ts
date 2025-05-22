import "fastify";

declare module "fastify" {
  interface FastifyRequest {
    api: {
      email: string;
    } | null;
  }
}
