import { Request, Response } from "express";
import { database } from "../../database";

class GetUserByUsernameController {
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
                return res.status(200).json({mensagem: "Usuário não encontrado"});
            }
            return res.status(200).json({user});
        } catch (error) {
            console.error(error);
            throw(error);
        }
    }
}

export { GetUserByUsernameController }