import { Request, Response } from "express";
import { database } from "../../database";

const bcrypt = require('bcrypt');

class RedefinePasswordController {
    async handle(req: Request | any, res: Response) {
        try {
            const userId = req.userId;
            const password = req.body.password;

            if (!password) {
                return res.status(400).json({mensagem: "A nova senha deve ser informada"});
            }

            if (!req.userId) {
                return res.clearCookie("recovery_token").status(500).json({mensagem: "Ocorreu um erro interno inesperado ao alterar senha. Tente solicitar um novo código mais tarde"});
            }

            // Criptografando nova senha (hashed password)
            const salt = await bcrypt.genSalt(10);
            const hashedPWD = await bcrypt.hash(password, salt);

            const updatedUser = await database.user.update({
                where: {
                    id: Number(userId)
                },
                data: {
                    password: hashedPWD
                }
            });

            return res.clearCookie("recovery_token").status(200).json({mensagem: "Senha atualizada com sucesso"});
        } catch (error) {
            console.error(error);
            throw(error);
        }
    }
}

export { RedefinePasswordController }