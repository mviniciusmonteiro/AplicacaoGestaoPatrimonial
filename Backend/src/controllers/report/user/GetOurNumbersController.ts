import { Request, Response } from "express";
import { database } from "../../../database";

class GetOurNumbersController {
    async handle(req: Request, res: Response) {
        try {
            const itemsCount = await database.item.count();
            const usersCount = await database.user.count();
            return res.status(200).json({itemsQuantity: itemsCount, usersQuantity: usersCount});
        } catch (error) {
            console.error(error);
            throw(error);
        }
    }
}

export { GetOurNumbersController }