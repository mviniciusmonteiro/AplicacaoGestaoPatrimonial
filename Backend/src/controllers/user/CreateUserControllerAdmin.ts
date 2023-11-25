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

            // Verificando se já existe usuário com mesmo username ou se matrícula do funcionário já está vinculada a um usuário
            const userAlreadyExistOrEmpAlreadyLinked = await database.user.findFirst({
                where: {
                    OR: [
                        { username: { equals: username, mode: 'insensitive' } },
                        { employeeRegistration: registration }
                    ]
                }
            });

            if (userAlreadyExistOrEmpAlreadyLinked) {
                return res.status(400).json({mensagem: "Há um usuário cadastrado com mesmo nome de usuário ou matrícula informada já está vinculada a um usuário"});
            }

            // Verificando se já existe um funcionário com mesma matrícula
            const employee = await database.employee.findUnique({
                where: {
                    registration
                }
            });

            if (employee) {
                // Atualiza dados do funcionário
                if (employee.name.toLowerCase() != name.toLowerCase() || employee.email.toLowerCase() != email.toLowerCase()) {
                    // Verificando se email pertence a outro funcionário
                    const emailOfOtherEmployee = await database.employee.findFirst({
                        where: {
                            registration: {not: registration},
                            email: { equals: email, mode: 'insensitive' }
                        }
                    });
                    if (!emailOfOtherEmployee) {
                        // Atualiza os dados do funcionário com base nos dados repassados na requisição
                        const updatedEmployee = await database.employee.update({
                            where: {registration},
                            data: {
                                name,
                                email
                            }
                        });
                    } else {
                        return res.status(400).json({mensagem: "Há um funcionário cadastrado com mesmo email"});
                    }
                }
            } else {
                // Matrícula é única (funcionário não cadastrado): verifica se email está vinculado a outro funcionário
                const emailAlreadyExist = await database.employee.findFirst({
                    where: { email: { equals: email, mode: 'insensitive' } }
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