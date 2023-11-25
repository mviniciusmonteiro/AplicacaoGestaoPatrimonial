import { Request, Response } from "express";
import { database } from "../../../database";

class GetCountOfUsersController {
    async handle(req: Request, res: Response) {
        try {
            const usersCount = await database.user.count();
            return res.status(200).json({usersCount});
        } catch (error) {
            console.error(error);
            throw(error);
        }
    }
}

export { GetCountOfUsersController }