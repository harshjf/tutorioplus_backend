import type { Request, RequestHandler, Response } from "express";

import { faqService } from "@/api/faq/faqService";
import { handleServiceResponse } from "@/common/utils/httpHandlers";

class FaqController{
    public getFaqs: RequestHandler = async (_req: Request, res: Response) => {
        const serviceResponse = await faqService.getAllFaqs();
        return handleServiceResponse(serviceResponse, res);
      };
}

export const faqController = new FaqController();