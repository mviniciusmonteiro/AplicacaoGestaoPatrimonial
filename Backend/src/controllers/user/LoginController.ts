import { Request, Response } from 'express';
import { database } from '../../database';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
                // Usuário cadastrado e credenciais corretas: gera token e salva nos cookies
                const token = jwt.sign(
                    {id: user.id, role: "captain"},
                    process.env.JWT_SECRET_KEY
                );
                
                return response.cookie('access_token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production"
                }).status(200).json({mensagem: "Login realizado com sucesso"});
            }
            return response.status(400).send("Usuário e/ou senha inválidos");
        } catch (error) {
            throw error;
        }
    }
}

export { LoginController }