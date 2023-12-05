import { Request, Response } from 'express';
import { database } from '../../database';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class LoginController {
    async handle(req: Request, res: Response) {
        try {
            const { username, password } = req.body;

            if (!(username && password)) {
                return res.status(400).json({mensagem: "Usuário e senha são obrigatórios"});
            }

            // Buscando dados do usuário
            const user = await database.user.findUnique({
                where: {
                    username
                }
            });

            if (user && (await bcrypt.compare(password, user.password))) {
                // Usuário cadastrado e credenciais corretas: gera token e salva nos cookies
                let role = user.isAdmin ? "admin" : "commom";
                const token = jwt.sign(
                    {id: user.id, role: role},
                    process.env.JWT_SECRET_KEY
                );
                
                return res.cookie('access_token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production"
                }).status(200).json({isAdmin: user.isAdmin});
            }
            return res.status(400).json({mensagem: "Usuário e/ou senha inválidos"});
        } catch (error) {
            throw error;
        }
    }
}

export { LoginController }