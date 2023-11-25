import { Request, Response } from "express";
import { database } from "../../database";

class GetAllEmployeesController {
    async handle(req: Request, res: Response) {
        try {
            const employees = await database.employee.findMany();

            if  (!employees) {
                return res.status(200).json({mensagem: "Nenhum funcionário encontrado"});
            }
            return res.status(200).json({employees});
        } catch (error) {
            console.error(error);
            throw(error);
        }
    }
}

export { GetAllEmployeesController }