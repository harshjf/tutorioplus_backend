import type { NewsAndAnnouncement } from "@/api/news/newsAndAnnouncementModel";
import { query } from "@/common/models/database";

export class NewsAndAnnouncementRepository {
  async getAllNewsAndAnnouncements(): Promise<NewsAndAnnouncement[]> {
    const sql = `SELECT * FROM newsandannouncements`;
    const result = await query(sql);
    return result;
  }

  async addNewsAndAnnouncement(title: string, description: string): Promise<NewsAndAnnouncement> {
    const sql = `
      INSERT INTO newsandannouncements (title, description)
      VALUES ($1, $2)
      RETURNING *
    `;
    const values = [title, description];
    const result = await query(sql, values);
    return result[0];
  }
}
