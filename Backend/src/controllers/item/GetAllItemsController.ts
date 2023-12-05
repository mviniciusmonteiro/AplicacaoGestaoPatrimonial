import { Request, Response } from "express";
import { database } from "../../database";

class GetAllItemsController {
    async handle(req: Request, res: Response) {
        try {
            const items = await database.item.findMany();
            return res.status(200).json({items});
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

export { GetAllItemsController }