import { Request, Response } from "express";
import { database } from "../../database";
import { Prisma } from "@prisma/client";

class DeleteEmployeeController {
    async handle(req:Request, res: Response) {
        try {
            const registration = req.params.registration;

            // Verificando se funcionário existe
            const employee = await database.employee.findUnique({
                where: { registration: Number(registration) }
            });

            if (!employee) {
                return res.status(400).json({mensagem: "Funcionário não encontrado"});
            }

            const employeeIsUser = await database.user.findFirst({
                where: {
                    employeeRegistration: employee?.registration
                }
            });

            if (employeeIsUser) {
                return res.status(400).json({mensagem: "Funcionário está vinculado a usuário. Para apagar seus dados, acesse a página de exclusão de usuário!"});
            }

            const deletedEmployee = await database.employee.delete({
                where: { registration: Number(registration) }
            });

            return res.status(200).json({deletedEmployee});
        } catch (error) {
            // Tratando erro de restrição de chave
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code == 'P2003') {
                // Um erro de restrição de chave ocorreu, informa o fato
                return res.status(400).json({mensagem: "Funcionário não pode ser excluído pois está vinculado a Projeto ou a uma solicitação de relatório!"});
            }
            console.error(error);
            throw(error);
        }
    }
}

export { DeleteEmployeeController }