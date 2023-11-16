import { Request, Response } from "express";

class RespondToReportRequest {
    async handle(req: Request | any, res: Response) {
        try {
            
        } catch (error) {
            console.error(error);
            throw(error);
        }
    }
}

export { RespondToReportRequest }