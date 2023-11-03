import { Request, Response } from 'express';
import { database } from '../../database';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class CreateUserController {
    async handle(req: Request, res: Response) {
        try {
            const {username, password, registration, name, email, isAdmin } = req.body;
            
            if (!(username && password && registration && name && email)) {
                return res.status(400).send("Nome de usuário, senha, matrícula, nome e email são campos obrigatórios");
            }

            // Verificando se já existe usuário com mesmo username
            const usernameAlreadyExist = await database.user.findUnique({
                where: {
                    username
                }
            });

            // Verificando se já existe usuário com mesma matrícula ou email
            const registrationOrEmailAlreadyExist = await database.profileData.findFirst({
                where: {
                    OR: [
                        { registration },
                        { email }
                    ]
                }
            });

            if (usernameAlreadyExist) {
                return res.status(400).send("Há um usuário cadastrado com mesmo nome de usuário");
            }

            if (registrationOrEmailAlreadyExist) {
                return res.status(400).send("Há um usuário cadastrado com mesmo número de matrícula ou email");
            }


            // Criptografando a senha (hashed password)
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Dados do perfil do usuário
            const userData = await database.profileData.create({
                data: {
                    registration,
                    name,
                    email
                }
            });
            // Dados de login
            const newUser = await database.user.create({
                data: {
                    username,
                    password: hashedPassword,
                    userRegistration: registration,
                    isAdmin: isAdmin == undefined ? false : isAdmin
                }
            });
            return res.status(201).json(
                {
                    user: newUser
                }
            );
        } catch (error) {
            throw error;
        }
    }
}

export { CreateUserController };