import { Request, Response } from "express";
import { database } from "../../../database";

class ReportRequestController {
    async handle(req: Request | any, res: Response) {
        try {
            const { description, motiveOfRequest } = req.body;
            if (!description) {
                return res.status(400).json({mensagem: "Descrição do relatório é obrigatória"});
            }
            // Buscando matrícula do usuário logado
            const loggedUser = await database.user.findFirst({
                where: { id: req.userId }
            });
            const requestedBy = loggedUser?.employeeRegistration;
            const newReportRequest = await database.reportRequest.create({
                data: {
                    requestedBy,
                    description,
                    motiveOfRequest,
                    status: 'Pendente'
                }
            });
            return res.status(201).json({newReportRequest});
        } catch (error) {
            console.error(error);
            throw(error);
        }
    }
}

export { ReportRequestController }