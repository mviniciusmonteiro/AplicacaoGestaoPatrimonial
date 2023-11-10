import { Request, Response } from "express";
import { database } from "../../database";

class GetProjectById {
    async handle(req: Request, res: Response) {
        try {
            const projectId = req.params.projectId;

            const project = await database.project.findUnique({
                where: {id: Number(projectId)}
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

export { GetProjectById }