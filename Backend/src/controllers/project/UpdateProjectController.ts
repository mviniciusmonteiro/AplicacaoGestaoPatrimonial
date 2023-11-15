import { Request, Response } from "express";
import { database } from "../../database";

class UpdateProjectController {
    async handle(req: Request, res: Response) {
        try {
            const { name, coordinatorRegistration } = req.body;
            const projectName = req.params.name;

            if (!projectName) {
                return res.status(400).json({mensagem: "O id do projeto é obrigatório"});
            }

            if (!(name && coordinatorRegistration)) {
                return res.status(400).json({mensagem: "Nome do projeto e matrícula do coordenador são obrigatórios"});
            }

            // Verificando se há um projeto com id buscado
            const oldProject = await database.project.findFirst({
                where: { name: { equals: projectName, mode: 'insensitive' } }
            });

            if (!oldProject) {
                return res.status(400).json({mensagem: "Projeto não encontrado"});
            }

            // Verificando se já existe projeto com mesmo nome
            const nameAlreadyExist = await database.project.findFirst({
                where: { 
                    id: { not: oldProject.id },
                    name: {equals: name, mode: 'insensitive'}} // Busca por correspondência exata, sem diferenciar maiúsculas de minúsculas
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
                where: { id: oldProject.id },
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