import { Request, Response } from "express";
import { database } from "../../database";

class CreateEmployeeController {
    async handle(req: Request, res: Response) {
        try {
            let { registration, name, email } = req.body;

            if (!(registration && name && email)) {
                return res.status(400).json({mensagem: "Matrícula, nome e email são obrigatórios"});
            }

            // Verificando se já existe funcionário com mesmo número de matrícula ou email
            const registrationAlreadyExist = await database.employee.findFirst({
                where: {
                    OR: [
                        {registration},
                        {email : { equals: email, mode: 'insensitive' }}
                    ]
                }
            });

            if (registrationAlreadyExist) {
                return res.status(400).json({mensagem: "Já existe funcionário com mesma matrícula ou email"});
            }

            const newEmployee = await database.employee.create({
                data: {
                    registration,
                    name,
                    email
                }
            });

            return res.status(201).json({newEmployee});
        } catch (error) {
            console.error(error);
            throw(error);
        }
    }
}

export { CreateEmployeeController }