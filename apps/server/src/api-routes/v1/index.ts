import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { getRandomUniqueIntegers } from "../../libs/generate-random-integers";

export const routes = async (
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) => {
  fastify.addHook("preHandler", options.preHandler.apiGuard);

  fastify.get("/images", async (req, res) => {
    const pgConn = await fastify.pg.connect();
    try {
      // fetch total image count
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
      pgConn.release();
    }
  });
};
