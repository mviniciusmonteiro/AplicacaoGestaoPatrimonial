import { Request, Response } from "express";
import { database } from "../../database";

const utils = require('../../utils/index.js');

class GetItemByNumberOfPatrimony {
    async handle(req: Request, res: Response) {
        try {
            const numberOfPatrimony = req.params.id;

            if (!numberOfPatrimony) {
                return res.status(400).send("O número de patrimônio do item deve ser informado");
            }

            // Buscando dados do item
            const item = await database.item.findUnique({
                where: {
                    numberOfPatrimony: Number(numberOfPatrimony)
                }
            });

            if (!item) {
                return res.status(200).json({});
            }

            let image = null;
            // Buscando a imagem associada ao item
            if (item.imageId) {
                image = await database.image.findUnique({
                    where: {
                        id: item.imageId
                    }
                });
                if (image) {
                    utils.base64_decode(image.file, image.fileName);
                }
            }
            return res.status(200).json({
                item,
                image
            });
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

export { GetItemByNumberOfPatrimony };