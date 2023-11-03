import { Request, Response } from 'express';
import { database } from '../../database';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class CreateUserController {
    async handle(req: Request, res: Response) {
        const {username, password, registration, name, email, isAdmin } = req.body;
        let _isAdmin = isAdmin == undefined ? false : isAdmin;
        
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

        // Garantindo que apenas usuários administradores criarão usuários administradores
        if (req.params.userid == undefined) {
            // Controller acessado por usuário não logado: cria apenas usuário comum
            _isAdmin = false;
        } else {
            const creatorIsAdmin = await database.user.findUnique({
                where: {
                    id: (Number)(req.params.userid),
                    isAdmin: true
                }
            });
            if (!creatorIsAdmin) {
                // Novo usuário será criado por usuário logado, mas que não é administrador (caso de exceção, front não deve oferecer essa opção ao usuário comum)
                _isAdmin = false;
            }
        }

        // Criptografando a senha (hashed password)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        try {
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
                    isAdmin: _isAdmin
                }
            });

            return res.status(201).json(
                {
                    user: newUser
                }
            );
        } catch (e) {
            return res.status(500).json("Ocorreu um erro interno ao tentar criar o usuário");
        }
    }
}

export { CreateUserController };