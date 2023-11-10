import { Request, Response } from "express";
import { database } from "../../database";

class CreateProjectController {
    async handle(req: Request, res: Response) {
        try {
            const { name, coordinatorRegistration } = req.body;

            if (!(name && coordinatorRegistration)) {
                return res.status(400).json({mensagem: "Nome do projeto e matrícula do coordenador são obrigatórios"});
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

            const newProject = await database.project.create({
                data: {
                    name,
                    coordinateRegistration: coordinatorRegistration
                }
            });

            return res.status(201).json({newProject});
        } catch (error) {
            console.error(error);
            throw(error);
        }
    }
}

export { CreateProjectController }