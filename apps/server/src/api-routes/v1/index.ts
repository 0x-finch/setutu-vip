import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { getRandomUniqueIntegers } from "src/libs/generate-random-integers";
import rateLimit from "@fastify/rate-limit";

export const routes = async (
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) => {
  fastify.addHook("preHandler", options.preHandler.apiGuard);
  fastify.register(rateLimit, {
    max: 5,
    timeWindow: "1 minute",
    ban: 3,
    keyGenerator: (req) => {
      const token = req.headers["x-setutu-api-token"];
      return typeof token === "string" ? token : req.ip;
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
    try {
      // fetch total image count
      const pgConn = await fastify.pg.connect();
      const result = await pgConn.query("SELECT COUNT(*) FROM image");
      const totalImageCount = parseInt(result.rows[0].count, 10);

      // random generate random 9 integers between 1 and total image count
      const randomIds = getRandomUniqueIntegers(9, totalImageCount);
      // !TODO: check redis cache first

      const { rows: randomImages } = await pgConn.query(
        `SELECT * FROM image WHERE id = ANY($1::int[])`,
        [randomIds]
      );

      return {
        code: 200,
        data: {
          images: randomImages,
        },
        message: "success",
      };
    } catch (error) {
      return {
        code: 500,
        data: null,
        message: `Internal server error: ${error}`,
      };
    }
  });
};
