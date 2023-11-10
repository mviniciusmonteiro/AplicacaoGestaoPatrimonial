import { Request, Response } from "express";
import { database } from "../../database";

class DeleteProjectController {
    async handle(req: Request, res: Response) {
        try {
            const projectId = req.params.projectId;

            if (!projectId) {
                return res.status(404).json({mensagem: "O id do projeto é obrigatório"});
            }

            const project = await database.project.findUnique({
                where: { id: Number(projectId) }
            });

            if (!project) {
                return res.status(400).json({mensagem: "Projeto não encontrado"});
            }

            const deletedProject = await database.project.delete({
                where: {id: Number(projectId)}
            });

            return res.status(200).json({deletedProject});
        } catch (error) {
            console.error(error);
            throw(error);
        }
    }
}

export { DeleteProjectController }