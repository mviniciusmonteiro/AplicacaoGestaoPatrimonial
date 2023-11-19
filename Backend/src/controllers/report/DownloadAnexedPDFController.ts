import { Request, Response } from "express";
import { database } from "../../database";

const fs = require('fs');

class DownloadAnexedPDFController {
    async handle(req: Request, res: Response) {
        const requestId = req.params.requestId;

        if (!requestId) {
            return res.status(404).json({mensagem: "o id da solicitação de relatório deve ser informado"});
        }        

        // Buscando solicitação de relatório para obter o caminho do arquivo
        const reportRequest = await database.reportRequest.findUnique({
            where: {id: Number(requestId) }
        });
        if (!reportRequest) {
            return res.status(400).json({mensagem: "Solicitação de relatório não encontrada"});
        }
        const filename = reportRequest.filePath;
        if (!filename) {
            return res.status(400).json({mensagem: "Solicitação de relatório não possui arquivo pdf anexado"});
        }
        const path = process.env.UPLOADS_PATH + '/pdf/' + filename;
        const file = fs.createReadStream(path);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment: filename="' + filename + '');
        file.pipe(res);
    }
}

export { DownloadAnexedPDFController }