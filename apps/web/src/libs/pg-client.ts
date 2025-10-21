import { Pool } from "pg";
import { getRandomUniqueIntegers } from "./generate-random-integers";

// Create a single pool instance to be reused
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export const pgClient = async () => {
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
    const result = await client.query("SELECT COUNT(*) FROM images");
    const totalImageCount = parseInt(result.rows[0].count, 10);
    const randomIds = getRandomUniqueIntegers(count, totalImageCount);
    const { rows: randomImages } = await client.query(
      `SELECT * FROM images WHERE id = ANY($1::int[])`,
      [randomIds]
    );

    return randomImages.map((image: { url: string; sttid: string }) => ({
      url: image.url,
      sttid: image.sttid,
    }));
  } catch (error) {
    console.error("Database error:", error);
    throw new Error(
      `Failed to fetch images: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  } finally {
    client.release();
  }
};
