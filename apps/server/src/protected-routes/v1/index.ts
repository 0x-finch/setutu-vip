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
    const results: { sttid: string; url: string; error?: string }[] = [];
    for (const imageUrl of imageUrlsArray) {
      try {
        const result = await pgConn.query(
          "INSERT INTO image (url, created_at, source, sttid) VALUES ($1, $2, $3, $4) RETURNING *",
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
          error: (error as Error).message,
        });
      } finally {
        pgConn.release();
      }
    }

    const successCount = results.filter((result) => !!result.sttid).length;
    const errorCount = results.length - successCount;

    return {
      code: successCount > 0 ? 201 : 500,
      data: results,
      message:
        successCount > 0
          ? `Images inserted successfully: ${successCount}`
          : `Images inserted failed: ${errorCount}`,
    };
  });
};
