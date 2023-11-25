import { Request, Response } from "express";
import { database } from "../../database";

class GetLocalById {
    async handle(req: Request, res: Response) {
        try {
            const locationId = req.params.locationId;

            if (!locationId) {
                return res.status(404).json({mensagem: "O id do local é obrigatório"});
            }
        
            const local = await database.local.findUnique({
                where: {id: Number(locationId)}
            });

            if (!local) {
                return res.status(200).json({mensagem: "Local não encontrado"});
            }

            return res.status(200).json({local});
        } catch (error) {
            console.error(error);
            throw(error);
        }
    }
}

export { GetLocalById }