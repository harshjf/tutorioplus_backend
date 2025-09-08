import axios, { AxiosInstance } from "axios";

export interface SendTemplateParams {
	to: string;
	from?: string;
	templateName: string;
	language: string;
	variables?: string[];
}

export class DoubleTickClient {
	private http: AxiosInstance;
	private apiKey: string;
	private defaultFrom?: string;

	constructor() {
		const baseURL = process.env.DOUBLETICK_BASE_URL || "https://public.doubletick.io";
		this.apiKey = process.env.DOUBLETICK_API_KEY || "";
		this.defaultFrom = process.env.DOUBLETICK_DEFAULT_FROM;
        console.log("Default API Key", this.apiKey);
		this.http = axios.create({
			baseURL,
			timeout: 10000,
			headers: {
				Authorization: this.apiKey,
				Accept: "application/json",
				"Content-Type": "application/json",
			},
		});
	}

	async sendTemplate(params: SendTemplateParams) {
		const from = params.from || this.defaultFrom;
		if (!from) throw new Error("Missing DoubleTick 'from' number");

		const payload: any = {
			messages: [
				{
					content: {
						language: params.language,
						templateName: params.templateName,
					},
					from,
					to: params.to,
				},
			],
		};

		const res = await this.http.post("/whatsapp/message/template", payload);
        console.log("Whatsapp Api Response", res);
		return res.data;
	}
}

export const doubleTickClient = new DoubleTickClient();