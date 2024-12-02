import type { Request, RequestHandler, Response } from "express";
import { newsAndAnnouncementService } from "@/api/news/newsAndAnnouncementService";
import { handleServiceResponse } from "@/common/utils/httpHandlers";

class NewsAndAnnouncementController {
  public getNewsAndAnnouncements: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await newsAndAnnouncementService.getAllNewsAndAnnouncements();
    return handleServiceResponse(serviceResponse, res);
  };

  public createNewsAndAnnouncement: RequestHandler = async (req: Request, res: Response) => {
    const { title, description } = req.body;
    const serviceResponse = await newsAndAnnouncementService.addNewsAndAnnouncement(title, description);
    return handleServiceResponse(serviceResponse, res);
  };
}

export const newsAndAnnouncementController = new NewsAndAnnouncementController();
