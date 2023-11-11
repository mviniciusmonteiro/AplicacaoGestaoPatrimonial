import { Request, Response } from "express";
import { database } from "../../database";

class CreateLocalController {
    async handle(req: Request, res: Response) {
        try {
            const { departmentBuilding, room } = req.body;

            if (!(departmentBuilding && room)) {
                return res.json(400).json({mensagem: "Bloco e sala são obrigatórios"});
            }

            // Verificando se já existe um local (bloco, sala) cadastrada
            const localAlreadyExist = await database.local.findFirst({
                where: {
                    departmentBuilding: { equals: departmentBuilding, mode: 'insensitive' }, // Busca por correspondência exata, sem diferenciar maiúsculas de minúsculas
                    room: { equals: room, mode: 'insensitive' }
                }
            });

            if (localAlreadyExist) {
                return res.status(400).json({mensagem: "Já existe um local com mesmo bloco e sala cadastrado"});
            }

            const newLocal = await database.local.create({
                data: {
                    departmentBuilding,
                    room
                }
            });

            return res.status(201).json({local: newLocal});
        } catch (error) {
            console.error(error);
            throw(error);
        }
    }
}

export { CreateLocalController }