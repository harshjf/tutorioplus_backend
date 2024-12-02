import { StatusCodes } from "http-status-codes";
import type { NewsAndAnnouncement } from "@/api/news/newsAndAnnouncementModel";
import { NewsAndAnnouncementRepository } from "@/api/news/newsAndAnnouncementRepository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";

class NewsAndAnnouncementService {
  private newsAndAnnouncementRepository: NewsAndAnnouncementRepository;

  constructor(repository: NewsAndAnnouncementRepository = new NewsAndAnnouncementRepository()) {
    this.newsAndAnnouncementRepository = repository;
  }

  async getAllNewsAndAnnouncements(): Promise<ServiceResponse<NewsAndAnnouncement[] | null>> {
    try {
      const newsAndAnnouncements = await this.newsAndAnnouncementRepository.getAllNewsAndAnnouncements();
      return ServiceResponse.success<NewsAndAnnouncement[]>("News and Announcements found", newsAndAnnouncements);
    } catch (e) {
      const errorMessage = `Error occurred while fetching news and announcements: ${e}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while fetching news and announcements",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async addNewsAndAnnouncement(title: string, description: string): Promise<ServiceResponse<NewsAndAnnouncement | null>> {
    try {
      const newsAndAnnouncement = await this.newsAndAnnouncementRepository.addNewsAndAnnouncement(title, description);
      return ServiceResponse.success<NewsAndAnnouncement>("News and Announcement added successfully", newsAndAnnouncement);
    } catch (e) {
      const errorMessage = `Error occurred while creating news and announcement: ${e}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("An error occurred while adding news and announcement", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

export const newsAndAnnouncementService = new NewsAndAnnouncementService();
