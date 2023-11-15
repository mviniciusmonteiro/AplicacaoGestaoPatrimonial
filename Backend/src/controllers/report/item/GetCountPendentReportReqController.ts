import { Request, Response } from "express";
import { database } from "../../../database";

class GetCountPendentReportReqController {
    async handle(req: Request, res: Response) {
        try {
            const pendentReqCount = await database.reportRequest.count({
                where: { status: "Pendente" }
            });
            return res.status(200).json({pendentReqCount});
        } catch (error) {
            console.error(error);
            throw(error);
        }
    }
}

export { GetCountPendentReportReqController }