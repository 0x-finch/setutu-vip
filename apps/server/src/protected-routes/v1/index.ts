import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { nanoid } from "nanoid";

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
    const results: { sttid: string; url: string }[] = [];
    for (const imageUrl of imageUrlsArray) {
      try {
        const result = await pgConn.query(
          "INSERT INTO image (url, created_at, source, sttid) VALUES ($1, $2, $3, $4)",
          [imageUrl, new Date(), source, nanoid(32)]
        );

        results.push({
          sttid: result.rows[0].sttid,
          url: result.rows[0].url,
        });
      } catch (error) {
        console.error(error);
        results.push({
          sttid: "",
          url: imageUrl,
        });
      } finally {
        pgConn.release();
      }
    }

    return {
      code: 201,
      data: results,
      message: "Images inserted successfully",
    };
  });
};
