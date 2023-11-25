import { Request, Response } from "express";
import { database } from "../../../database";

class GetReportRequestByStatusController {
    async handle(req: Request | any, res: Response) {
        try {
            let status = req.params.status;
            if (!status) {
                status = "Todas";
            }
            
            let filteredReportReq = {};
            if (req.userRole == "commom") {
                // Usuário comum apenas visualiza suas próprias requisições de relatório
                // Matrícula do usuário logado
                const loggedUser = await database.user.findFirst({
                    where: { id: req.userId }
                });
                if (status == "Todas") {
                    filteredReportReq = await database.reportRequest.findMany({
                        where: { requestedBy: loggedUser?.employeeRegistration }
                    });
                } else {
                    filteredReportReq = await database.reportRequest.findMany({
                        where: { 
                            requestedBy: loggedUser?.employeeRegistration,
                            status
                        }
                    });
                }
            } else {
                if (status == "Todas") {
                    filteredReportReq = await database.reportRequest.findMany();
                } else {
                    filteredReportReq = await database.reportRequest.findMany({
                        where: { status }
                    });
                }
            }
            return res.status(200).json({filteredReportReq});
        } catch (error) {
            console.error(error);
            throw(error);
        }
    }
}

export { GetReportRequestByStatusController }