import { Request, Response } from "express";
import { database } from "../../database";

class GetLoggedUserDataController {
    async handle(req: Request | any, res: Response) {
        try {
            const userId = req.userId;

            if (!userId) {
                return res.status(403).json({mensagem: "Acesso não autorizado. Faça login para continuar"});
            }

            const user = await database.user.findFirst({
                where: { id: Number(userId) }
            });

            if (!user) {
                return res.status(403).json({mensagem: "Acesso não autorizado. Faça login para continuar"});
            }

            const employee = await database.employee.findFirst({
                where: { registration: user?.employeeRegistration }
            });
            return res.status(200).json({loggedUser: {registration: employee?.registration, username: user.username, name: employee?.name, email: employee?.email}});
        } catch (error) {
            console.error(error);
            throw(error);
        }
    }
}

export { GetLoggedUserDataController }