import { Request, Response } from "express";
import { database } from "../../database";

class GetAllLocationsController {
    async handle(req: Request, res: Response) {
        try {
            const locations = await database.local.findMany();
            return res.status(200).json({locations});
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

export { GetAllLocationsController }