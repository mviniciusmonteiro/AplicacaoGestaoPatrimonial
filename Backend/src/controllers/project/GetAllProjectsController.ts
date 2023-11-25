import { Request, Response } from "express";
import { database } from "../../database";

class GetAllProjectsController {
    async handle(req: Request, res: Response) {
        try {
            const projects = await database.project.findMany();
            if (!projects) {
                return res.status(200).json({mensagem: "Nenhum projeto encontrado"});
            }
            return res.status(200).json({projects});
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

export { GetAllProjectsController }