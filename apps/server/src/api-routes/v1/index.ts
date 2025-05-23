import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { getRandomUniqueIntegers } from "../../libs/generate-random-integers";
import rateLimit from "@fastify/rate-limit";
export const routes = async (
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) => {
  fastify.decorateRequest("api", null);
  fastify.addHook("preHandler", options.preHandler.apiGuard);
  await fastify.register(rateLimit, {
    max: 5,
    timeWindow: "1 minute",
    ban: 3,
    keyGenerator: (req) => {
      return req.api?.email ?? "unauthenticated";
    },
    errorResponseBuilder: (req, context) => ({
      code: 429,
      data: null,
      message: {
        en: "Rate limit exceeded(5 times per minute). Please try again in 3 minutes.",
        cn: "请求次数超过限制(每分钟5次)。请3分钟后再试。",
        ko: "요청 횟수가 제한을 초과했습니다(1분에 5번). 3분 후에 다시 시도해주세요.",
        jp: "リクエスト数が制限を超えました(1分に5回)。3分後に再度お試しください。",
      },
    }),
  });

  fastify.get("/images", async (req, res) => {
    const client = await fastify.pg.connect();
    try {
      // fetch total image count
      const result = await client.query("SELECT COUNT(*) FROM image");
      const totalImageCount = parseInt(result.rows[0].count, 10);

      // random generate random 20 integers between 1 and total image count
      const randomIds = getRandomUniqueIntegers(20, totalImageCount);
      // !TODO: check redis cache first

      const { rows: randomImages } = await client.query(
        `SELECT * FROM image WHERE id = ANY($1::int[])`,
        [randomIds]
      );

      return {
        code: 200,
        data: {
          images: randomImages.map(
            (image: { id: number; url: string; sttid: string }) => ({
              url: image.url,
              sttid: image.sttid,
            })
          ),
        },
        message: "success",
      };
    } catch (error) {
      return {
        code: 500,
        data: null,
        message: `Internal server error: ${error}`,
      };
    } finally {
      client.release();
    }
  });
};
