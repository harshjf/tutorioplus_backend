import { Pool } from "pg";
import { dbConfig } from "../../config/index";

const pool = new Pool(dbConfig);

export const query = async (text: string, params?: any[]): Promise<any> => {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result.rows;
  } finally {
    client.release();
  }
};

export default pool;