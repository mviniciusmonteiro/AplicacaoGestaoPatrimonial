import { Request, Response } from "express";
import { database } from "../../../database";

class GetCountOfItemsController {
    async handle(req: Request, res: Response) {
        try {
            const itemsCount = await database.item.count();
            return res.status(200).json({itemsCount});
        } catch (error) {
            console.error(error);
            throw(error);
        }
    }
}

export { GetCountOfItemsController }