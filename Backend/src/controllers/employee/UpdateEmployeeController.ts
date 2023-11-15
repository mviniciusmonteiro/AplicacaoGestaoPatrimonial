import { Request, Response } from "express";
import { database } from "../../database";

class UpdateEmployeeController {
    async handle(req: Request, res: Response) {
        try {
            const registrationParam = req.params.registration;
            let { name, email } = req.body;

            if (!(name && email)) {
                return res.status(400).json({mensagem: "Nome e email são obrigatórios"});
            }

            // Verificando se funcionário existe
            const employee = await database.employee.findUnique({
                where: { registration: Number(registrationParam)}
            });

            if (!employee) {
                return res.status(400).json({mensagem: "Funcionário não encontrado"});
            }

            // Verificando se já existe funcionário com mesmo email
            const registrationAlreadyExist = await database.employee.findFirst({
                where: {
                    registration: { not: employee.registration},
                    email : { equals: email, mode: 'insensitive' }
                }
            });

            if (registrationAlreadyExist) {
                return res.status(400).json({mensagem: "Já existe funcionário com mesmo email"});
            }

            const updatedEmployee = await database.employee.update({
                where: {registration: Number(registrationParam)},
                data: {
                    name,
                    email
                }
            });

            return res.status(200).json({updatedEmployee});
        } catch (error) {
            console.error(error);
            throw(error);
        }
    }
}

export { UpdateEmployeeController }