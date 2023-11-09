import { Request, Response } from "express";
import { database } from "../../database";

const fs = require('fs');

class DeleteItemController {
    async handle(req: Request, res: Response) {
        try {
            const numberOfPatrimony = req.params.numberOfPatrimony;
            
            if (!numberOfPatrimony) {
                return res.status(404).json({mensagem: "O número de patrimônio do item deve ser informado"});
            }

            const item = await database.item.findUnique({
                where: { numberOfPatrimony: Number(numberOfPatrimony) }
            });

            if (!item) {
                return res.status(400).json({mensagem: "Item não encontrado"});
            }

            // Deletando imagem
            if (item.imageName) {
                fs.unlinkSync(process.env.UPLOADS_PATH + '/images/' + item.imageName);
            }
            // Deletando item
            await database.item.delete({
                where: { id: item.id }
            });

            return res.status(200).json({
                item
            });
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

export { DeleteItemController };