import { Request, Response } from 'express';
import { database } from '../../database';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class CreateUserControllerAdmin {
    async handle(req: Request, res: Response) {
        try {
            const {username, password, registration, name, email, isAdmin } = req.body;
            let _isAdmin = isAdmin == undefined ? false : isAdmin;

            if (!(username && password && registration && name && email)) {
                return res.status(400).json({mensagem: "Nome de usuário, senha, matrícula, nome e email são campos obrigatórios"});
            }

            // Verificando se já existe usuário com mesmo username
            const usernameAlreadyExist = await database.user.findUnique({
                where: {
                    username
                }
            });

            if (usernameAlreadyExist) {
                return res.status(400).json({mensagem: "Há um usuário cadastrado com mesmo nome de usuário"});
            }

            // Verificando se já existe um funcionário com mesma matrícula
            const employee = await database.employee.findFirst({
                where: {
                    registration
                }
            });

            if (!employee) {
                // Usuário administrador irá cadastrar um novo funcionário: verifica se email informado é único
                const emailAlreadyExist = await database.employee.findUnique({
                    where: {
                        email
                    }
                });
                if (emailAlreadyExist) {
                    return res.status(400).json({mensagem: "Há um funcionário cadastrado com mesmo email"});
                }
            }

            // Criptografando a senha (hashed password)
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            if (!employee) {
                // Cadastra dados do novo funcionário
                const newEmployee = await database.employee.create({
                    data: {
                        registration,
                        name,
                        email
                    }
                });
            }
            // Dados do funcionário
            const newUser = await database.user.create({
                data: {
                    username,
                    password: hashedPassword,
                    employeeRegistration: registration,
                    isAdmin: _isAdmin
                }
            });
            return res.status(201).json(
                { user: newUser }
            );
        } catch (error) {
            throw error;
        }
    }
}

export { CreateUserControllerAdmin };