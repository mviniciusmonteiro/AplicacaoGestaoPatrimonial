import { Request, Response } from "express";
import { database } from "../../database";

class DeleteProjectController {
    async handle(req: Request, res: Response) {
        try {
            const projectName = req.params.name;

            if (!projectName) {
                return res.status(404).json({mensagem: "O nome do projeto é obrigatório"});
            }

            const project = await database.project.findFirst({
                where: { name: { equals: projectName, mode: 'insensitive' } }
            });

            if (!project) {
                return res.status(400).json({mensagem: "Projeto não encontrado"});
            }

            const deletedProject = await database.project.delete({
                where: { id: project.id }
            });

            return res.status(200).json({deletedProject});
        } catch (error) {
            console.error(error);
            throw(error);
        }
    }
}

export { DeleteProjectController }