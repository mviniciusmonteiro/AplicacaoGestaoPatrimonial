import { Request, Response } from "express";

const fs = require('fs');

class DownloadAnexedPDFController {
    async handle(req: Request, res: Response) {
        const filename = req.params.filename;

        if (!filename) {
            return res.status(404).json({mensagem: "O nome do arquivo de relatório deve ser informado"});
        }

        const path = process.env.UPLOADS_PATH + '/pdf/' + filename;
        const file = fs.createReadStream(path);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment: filename="' + filename + '');
        file.pipe(res);
    }
}

export { DownloadAnexedPDFController }