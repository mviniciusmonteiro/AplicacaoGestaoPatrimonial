import { Request, Response } from 'express';
import { database } from '../../database';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

let refreshTokens: string[] = [];

class LoginController {
    async handle(request: Request, response: Response) {
        try {
            const { username, password } = request.body;

            if (!(username && password)) {
                return response.status(400).send("Usuário e senha são obrigatórios");
            }

            // Buscando dados do usuário
            const user = await database.user.findUnique({
                where: {
                    username
                }
            });

            if (user && (await bcrypt.compare(password, user.password))) {
                // Usuário cadastrado e credenciais corretas: cria token
                const token = jwt.sign(
                    { user_id: user.id, username: username },
                    process.env.JWT_SECRET_KEY,
                    { expiresIn: "5min" }
                );

                const refreshToken = jwt.sign(
                    { user_id: user.id, username: username },
                    process.env.JWT_SECRET_KEY
                )
                refreshTokens.push(refreshToken);

                return response.status(200).json({
                    user,
                    token,
                    refresh: refreshToken
                });
            }
            return response.status(400).send("Usuário e/ou senha inválidos");
        } catch (error) {
            throw error;
        }
    }
}

export { LoginController }