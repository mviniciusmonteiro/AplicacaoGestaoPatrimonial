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
                return res.status(400).json({message: "Nome de usuário, senha, nome e email são campos obrigatórios!"});
            }

            // Garantindo que usuário comum só atualiza os próprios dados e que se um parâmetro não for passado então edita os dados do usuário logado
            if (!usernameParam || req.userRole == "commom") {
                // Obtendo username do usuário logado
                const loggedUser = await database.user.findUnique({
                    where: { id: Number(req.userId) }
                });
                usernameParam = loggedUser?.username;
                if (req.userRole == "commom") {
                    _isAdmin = false;
                }
            }

            // Verificando se usuário existe
            const user = await database.user.findFirst({
                where: { username: {equals: usernameParam, mode: 'insensitive' } }
            });

            if (!user) {
                return res.status(400).json({message: "Usuário não encontrado!"});
            }

            // Verificando se já existe usuário com mesmo username
            const userAlreadyExist = await database.user.findFirst({
                where: {
                    id: {not: user.id},
                    username: { equals: username, mode: 'insensitive' }
                }
            });

            if (userAlreadyExist) {
                return res.status(400).json({message: 'Há um usuário cadastrado com mesmo nome de usuário!'});
            }

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
                    return res.status(400).json({message: "Há um usuário cadastrado com mesmo email!"});
                }
            }

            // Criptografando a senha (hashed password)
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Dados do funcionário
            const updatedUser = await database.user.update({
                where: { id: user.id },
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