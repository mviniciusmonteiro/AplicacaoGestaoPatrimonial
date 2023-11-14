import { Request, Response } from 'express';
import { database } from '../../database';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class UpdateUserController {
    async handle(req: Request | any, res: Response) {
        try {
            let usernameParam = req.params.username;
            const {username, password, name, email, isAdmin } = req.body;
            let _isAdmin = isAdmin == undefined ? false : isAdmin;

            if (!(username && password && name && email)) {
                return res.status(400).json({mensagem: "Nome de usuário, senha, nome e email são campos obrigatórios"});
            }

            // Verificando se usuário existe
            const user = await database.user.findFirst({
                where: { username: {equals: usernameParam, mode: 'insensitive' } }
            });

            if (!user) {
                return res.status(400).json({mensagem: "Usuário não encontrado"});
            }

            // Garantindo que usuário comum só atualiza os próprios dados
            if (!usernameParam) {
                // Obtendo username do usuário logado
                const loggedUser = await database.user.findUnique({
                    where: { id: Number(req.userId) }
                });
                usernameParam = loggedUser?.username;
                if (req.userRole == "commom") {
                    _isAdmin = false;
                }
            }

            // Verificando se já existe usuário com mesmo username
            const userAlreadyExistOrEmpAlreadyLinked = await database.user.findFirst({
                where: {
                    id: {not: user.id},
                    username: { equals: username, mode: 'insensitive' }
                }
            });

            if (userAlreadyExistOrEmpAlreadyLinked) {
                return res.status(400).json({mensagem: "Há um usuário cadastrado com mesmo nome de usuário"});
            }

            // Atualizando dados do funcionário (nome e email)
            const employee = await database.employee.findFirst({
                where: {
                    registration: user.employeeRegistration
                }
            });
            if (employee?.name.toLowerCase() != name.toLowerCase() || employee?.email.toLowerCase() != email.toLowerCase()) {
                // Verificando se email pertence a outro funcionário
                const emailOfOtherEmployee = await database.employee.findFirst({
                    where: {
                        registration: {not: user.employeeRegistration},
                        email: { equals: email, mode: 'insensitive' }
                    }
                });
                if (!emailOfOtherEmployee) {
                    // Atualiza os dados do funcionário com base nos dados repassados na requisição
                    const updatedEmployee = await database.employee.update({
                        where: {registration: user.employeeRegistration},
                        data: {
                            name,
                            email
                        }
                    });
                } else {
                    // Atualiza os dados do funcionário
                    const updatedEmployee = await database.employee.update({
                        where: { registration: user.employeeRegistration },
                        data: {
                            name,
                            email
                        }
                    });                    
                }
            }

            // Criptografando a senha (hashed password)
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Dados do funcionário
            const updatedUser = await database.user.update({
                where: { username: usernameParam },
                data: {
                    username,
                    password: hashedPassword,
                    isAdmin: _isAdmin
                }
            });
            return res.status(200).json({updatedUser});
        } catch (error) {
            throw error;
        }
    }
}

export { UpdateUserController };