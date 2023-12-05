import { Request, Response } from "express";
import { database } from "../../../database";

const moment = require('moment');

class RespondToReportRequest {
    async handle(req: Request | any, res: Response) {
        try {
            const { motiveOfIndefer } = req.body;
            const id = req.params.id;
            if (!id) {
                return res.status(400).json({mensagem: "O id da requisição de relatório éobrigatório"});
            }
            const reportRequest = await database.reportRequest.findFirst({
                where: {id: Number(id)}
            });
            if (!reportRequest) {
                return res.status(400).json({mensagem: "Solicitação de relatório não encontrada"});
            }
            if (!(motiveOfIndefer || req.file)) {
                return res.status(400).json({mensagem: "Motivo do indeferimento ou relatório pdf deve ser informado"});
            }
            // Buscando usuário logado
            const loggedUser = await database.user.findFirst({
                where: { id: req.userId }
            });

            // Salvando resposta da solicitação de relatório
            const answeredRequest = await database.reportRequest.update({
                where: { id: Number(id) },
                data: {
                    status: req.file === undefined ? "Indeferida" : "Deferida",
                    answeredBy: loggedUser?.employeeRegistration,
                    answeredAt: moment(),
                    motiveOfIndefer,
                    filePath: req.file === undefined ? null : req.file.filename
                }
            });
            return res.status(200).json({answeredRequest});
        } catch (error) {
            console.error(error);
            throw(error);
        }
    }
}

export { RespondToReportRequest }