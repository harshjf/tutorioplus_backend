import { StatusCodes } from "http-status-codes";

import type { Faq } from "@/api/faq/faqModel";
import { FaqRepository } from "@/api/faq/faqRepository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";

export class FaqService {
    private faqRepository: FaqRepository;
  
    constructor(repository: FaqRepository = new FaqRepository()) {
      this.faqRepository = repository;
    }
    async getAllFaqs(): Promise<ServiceResponse<Faq[] | null>> {
        try {
          const faqs = await this.faqRepository.getAllFaqs();
          return ServiceResponse.success<Faq[]>("Faqs found", faqs);
        } catch (e) {
            const errorMessage = `Error occured during fetching faqs: ${e}`;
            logger.error(errorMessage);
            return ServiceResponse.failure("An error occurred during fetching faqs", null, StatusCodes.INTERNAL_SERVER_ERROR);
        }
      }
    }

    export const faqService = new FaqService();
  