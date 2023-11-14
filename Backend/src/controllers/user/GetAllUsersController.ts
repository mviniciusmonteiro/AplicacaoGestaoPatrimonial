import { Request, Response } from "express";
import { database } from "../../database";

class GetAllUsersController {
    async handle(req: Request, res: Response) {
        try {
            const users = await database.user.findMany();
            if (!users) {
                return res.status(200).json({mensagem: "Nenhum usuário encontrado"});
            }
            return res.status(200).json({users});
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

export { GetAllUsersController }