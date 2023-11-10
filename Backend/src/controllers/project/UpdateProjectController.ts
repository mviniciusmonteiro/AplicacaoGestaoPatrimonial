import { Request, Response } from "express";
import { database } from "../../database";

class UpdateProjectController {
    async handle(req: Request, res: Response) {
        try {
            const { name, coordinatorRegistration } = req.body;
            const projectId = req.params.projectId;

            if (!projectId) {
                return res.status(400).json({mensagem: "O id do projeto é obrigatório"});
            }

            if (!(name && coordinatorRegistration)) {
                return res.status(400).json({mensagem: "Nome do projeto e matrícula do coordenador são obrigatórios"});
            }

            // Verificando se há um projeto com id buscado
            const oldProject = await database.project.findUnique({
                where: { id: Number(projectId) }
            });

            if (!oldProject) {
                return res.status(400).json({mensagem: "Projeto não encontrado"});
            }

            // Verificando se já existe projeto com mesmo nome
            const nameAlreadyExist = await database.project.findFirst({
                where: { name }
            });

            if (nameAlreadyExist) {
                return res.status(400).json({mensagem: "Já existe projeto com mesmo nome"});
            }

            // Verificando se matrícula do coordenador é válida
            const coordinatorIsValid = await database.employee.findUnique({
                where: {registration: coordinatorRegistration}
            });

            if (!coordinatorIsValid) {
                return res.status(400).json({mensagem: "Matrícula do coordenador não é válida"});
            }

            const updatedProject = await database.project.update({
                where: { id: Number(projectId)},
                data: {
                    name,
                    coordinatorRegistration
                }
            });

            return res.status(201).json({updatedProject});
        } catch (error) {
            console.error(error);
            throw(error);
        }
    }
}

export { UpdateProjectController }