
import type {Faq } from "@/api/faq/faqModel";
import {query} from "@/common/models/database"

export class FaqRepository {
    async getAllFaqs(): Promise<Faq[]> {
      const sql = "SELECT * FROM faqs";
      const result= await query(sql);
      return result;
    }
}