import { Request, Response } from "express";
import { database } from "../../database";

class GetProjectByNameController {
    async handle(req: Request, res: Response) {
        try {
            const projectName = req.params.name;

            const project = await database.project.findFirst({
                where: { name: { equals: projectName, mode: 'insensitive' } }
            });

            if (!project) {
                return res.status(200).json({mensagem: "Projeto não encontrado"});
            }

            return res.status(200).json({project});
        } catch (error) {
            console.error(error);
            throw(error);
        }
    }
}

export { GetProjectByNameController }