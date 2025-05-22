import { Pool } from "pg";
import { getRandomUniqueIntegers } from "./generate-random-integers";

export const pgClient = async () => {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  const client = await pool.connect();
  return client;
};

export const pgQuery = async (query: string, params: any[]) => {
  const client = await pgClient();
  const res = await client.query(query, params);
  client.release();
  return res;
};

export const pgQueryImages = async () => {
  try {
    const client = await pgClient();
    const result = await client.query("SELECT COUNT(*) FROM image");
    const totalImageCount = parseInt(result.rows[0].count, 10);
    const randomIds = getRandomUniqueIntegers(9, totalImageCount);
    const { rows: randomImages } = await client.query(
      `SELECT * FROM image WHERE id = ANY($1::int[])`,
      [randomIds]
    );
    client.release();
    return randomImages.map((image: { url: string; sttid: string }) => ({
      url: image.url,
      sttid: image.sttid,
    }));
  } catch (error) {
    console.error(error);
  }
  return null;
};
