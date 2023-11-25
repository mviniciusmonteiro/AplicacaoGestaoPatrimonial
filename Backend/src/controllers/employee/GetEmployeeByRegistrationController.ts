import { Request, Response } from "express";
import { database } from "../../database";

class GetEmployeeByRegistrationController {
    async handle(req: Request, res: Response) {
        try {
            const registration = req.params.registration;

            if (!registration) {
                return res.status(404).json({mensagem: "Matrícula do funcionário é obrigatória"});
            }

            const employee = await database.employee.findUnique({
                where: { registration: Number(registration) }
            });

            if (!employee) {
                return res.status(200).json({mensagem: "Funcionário não encontrado"});
            }

            return res.status(200).json({employee});
        } catch (error) {
            console.error(error);
            throw(error);
        }
    }
}

export { GetEmployeeByRegistrationController }