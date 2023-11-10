import { Request, Response } from "express";
import { database } from "../../database";

class UpdateLocalController {
    async handle(req: Request, res: Response) {
        try {
            const { departmentBuilding, room } = req.body;
            const locationId = req.params.locationId;

            if (!locationId) {
                return res.status(404).json({mensagem: "O id do local a ser atualizado é obrigatório"});
            }

            if (!(departmentBuilding && room)) {
                return res.status(400).json({mensagem: "Bloco e sala são obrigatórios"});
            }

            const local = await database.local.findFirst({
                where: {
                    id: Number(locationId)
                }
            });

            if (!local) {
                return res.status(400).json({mensagem: "Local não encontrado"});
            }

            // Verificando se já existe um local com mesmo bloco e sala cadastrados
            const localAlreadyExist = await database.local.findFirst({
                where: {
                    departmentBuilding,
                    room
                }
            });

            if (localAlreadyExist) {
                return res.status(400).json({mensagem: "Já existe um local com mesmo bloco e sala cadastrado"});
            }

            // Atualizando dados
            const updatedLocal = await database.local.update({
                where: {id: Number(locationId) },
                data: {
                    departmentBuilding,
                    room
                }
            });

            return res.status(200).json({updatedLocal});
        } catch (error) {
            console.error(error);
            throw(error);
        }
    }
}

export { UpdateLocalController }