import { Request, Response } from "express";
import { database } from "../../database";

class DeleteEmployeeController {
    async handle(req:Request, res: Response) {
        try {
            const registration = req.params.registration;

            // Verificando se funcionário existe
            const employee = await database.employee.findUnique({
                where: { registration: Number(registration) }
            });

            if (!employee) {
                res.status(400).json({mensagem: "Funcionário não encontrado"});
            }

            const deletedEmployee = await database.employee.delete({
                where: { registration: Number(registration) }
            });

            return res.status(200).json({deletedEmployee});
        } catch (error) {
            console.error(error);
            throw(error);
        }
    }
}

export { DeleteEmployeeController }