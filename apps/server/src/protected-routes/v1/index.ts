import { FastifyInstance, FastifyPluginOptions } from "fastify";

export const routes = async (
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) => {
  fastify.addHook("preHandler", options.preHandler.bearerTokenGuard);

  fastify.post("/images", async (req, res) => {
    const { imageUrls, source } = req.body as {
      imageUrls: string[] | string;
      source: string;
    };

    if (
      !imageUrls ||
      (Array.isArray(imageUrls) && imageUrls.length === 0) ||
      !source
    ) {
      return {
        code: 400,
        data: null,
        message: "Image URLs and source are required",
      };
    }

    const imageUrlsArray = Array.isArray(imageUrls) ? imageUrls : [imageUrls];

    const pgConn = await fastify.pg.connect();
    try {
      await pgConn.query("BEGIN");

      for (const imageUrl of imageUrlsArray) {
        await pgConn.query(
          "INSERT INTO image (url, created_at, source) VALUES ($1, $2, $3)",
          [imageUrl, new Date(), source]
        );
      }

      await pgConn.query("COMMIT");

      return {
        code: 201,
        data: {
          success: true,
        },
        message: "Images inserted successfully",
      };
    } catch (error) {
      await pgConn.query("ROLLBACK");
      return {
        code: 500,
        data: null,
        message: `Failed to insert images: ${(error as Error).message}`,
      };
    } finally {
      pgConn.release();
    }
  });
};
