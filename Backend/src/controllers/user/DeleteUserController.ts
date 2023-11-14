import { Request, Response } from "express";
import { database } from "../../database";

class DeleteUserController {
    async handle(req: Request, res: Response) {
        try {
            const username = req.params.username;

            if (!username) {
                return res.status(404).json({mensagem: "O username do usuário é obrigatório"});
            }

            const user = await database.user.findFirst({
                where: { username: { equals: username, mode: 'insensitive' } }
            });

            if (!user) {
                return res.status(400).json({mensagem: "Usuário não encontrado"});
            }

            // Deletando dados do usuário
            const deletedUser = await database.user.delete({
                where: { id: user.id }
            });

            // Deletando dados do funcionário
            const deletedEmp = await database.employee.delete({
                where: {
                    registration: deletedUser.employeeRegistration
                }
            });

            return res.status(200).json({deletedUser, deletedEmp});
        } catch (error) {
            console.error(error);
            throw(error);
        }
    }
}

export { DeleteUserController }