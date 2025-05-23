import { Pool } from "pg";
import { getRandomUniqueIntegers } from "./generate-random-integers";

export const pgClient = async () => {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  const client = await pool.connect();
  return client;
};

export const pgQuery = async (query: string, params: unknown[]) => {
  const client = await pgClient();
  const res = await client.query(query, params);
  client.release();
  return res;
};

export const pgQueryImages = async (count: number) => {
  const client = await pgClient();
  try {
    const result = await client.query("SELECT COUNT(*) FROM image");
    const totalImageCount = parseInt(result.rows[0].count, 10);
    const randomIds = getRandomUniqueIntegers(count, totalImageCount);
    const { rows: randomImages } = await client.query(
      `SELECT * FROM image WHERE id = ANY($1::int[])`,
      [randomIds]
    );

    return randomImages.map((image: { url: string; sttid: string }) => ({
      url: image.url,
      sttid: image.sttid,
    }));
  } catch (error) {
    console.error(error);
  } finally {
    client.release();
  }
};
