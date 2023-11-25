import { Request, Response } from "express";
import { database } from "../../database";

class GetItemByNumberOfPatrimony {
    async handle(req: Request, res: Response) {
        try {
            const numberOfPatrimony = req.params.numberOfPatrimony;

            if (!numberOfPatrimony) {
                return res.status(404).json({mensagem: "O número de patrimônio do item deve ser informado"});
            }

            // Buscando dados do item
            const item = await database.item.findUnique({
                where: {
                    numberOfPatrimony: Number(numberOfPatrimony)
                }
            });

            if (!item) {
                return res.status(200).json({mensagem: "Item não encontrado"});
            }

            return res.status(200).json({
                item
            });
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

export { GetItemByNumberOfPatrimony };