import { Request, Response } from "express";
import { database } from "../../database";

class DeleteLocalController {
    async handle(req: Request, res: Response) {
        try {
            const locationId = req.params.locationId;

            if (!locationId) {
                return res.status(404).json({mensagem: "O id do local é obrigatório"});
            }

            const local = await database.local.findUnique({
                where: { id: Number(locationId) }
            });

            if (!local) {
                return res.status(400).json({mensagem: "Local não encontrado"});
            }

            const deletedLocal = await database.local.delete({
                where: {id: Number(locationId)}
            });

            return res.status(200).json({deletedLocal});
        } catch (error) {
            console.error(error);
            throw(error);
        }
    }
}

export { DeleteLocalController }