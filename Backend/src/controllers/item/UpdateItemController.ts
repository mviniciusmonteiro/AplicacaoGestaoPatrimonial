import { Request, Response } from "express";
import { database } from "../../database";

const fs = require('fs');

class UpdateItemController {
    async handle(req: Request | any, res: Response) {
        try {
            let numberOfPatrimonyParam = req.params.numberOfPatrimony;
            
            if (!numberOfPatrimonyParam) {
                return res.status(404).json({mensagem: "O número de patrimônio do item deve ser informados"});
            }

            let { name, description, locationId, responsibleRegistration, projectId } = req.body;

            if (!(name && description && locationId)) {
                return res.status(400).json({mensagem: "Os campos número de patrimônio, nome, descrição e id da localização são obrigatórios"});
            }

            // Variáveis com os tipos definidos (necessário pois, nesse caso, como há um arquivo, os dados do body são passados por form-data - que tipa tudo como string)
            numberOfPatrimonyParam = Number(numberOfPatrimonyParam)
            responsibleRegistration = responsibleRegistration ? Number(responsibleRegistration) : null;
            projectId = projectId ? Number(projectId) : null;
            locationId = Number(locationId); 

            // Verificando se há um funcionário responsável e se sua matrícula é válida
            if (responsibleRegistration) {
                const registrationIsValid = await database.employee.findFirst({
                    where: {
                        registration: responsibleRegistration
                    }
                });

                if (!registrationIsValid) {
                    return res.status(400).json({mensagem: "A matrícula do responsável pelo item é inválida"});
                }
            }

            const oldItem = await database.item.findUnique({
                where: { numberOfPatrimony: numberOfPatrimonyParam }
            });

            if (!oldItem) {
                return res.status(400).json({mensagem: "Item do patrimônio não encontrado"});
            }

            const deleteImage = (path: String) => {
                
            }

            if (req.file?.originalname != oldItem.imageName) {
                // Usuário enviou uma imagem e há uma imagem cadastrada
                // Apaga imagem antiga e multer irá inserir a nova
                fs.unlinkSync(process.env.UPLOADS_PATH + '/images/' + oldItem.imageName);
            }

            // Atualizando dados do item
            const updatedItem = await database.item.update({
                where: { numberOfPatrimony: Number(numberOfPatrimonyParam) },
                data: {
                    name,
                    description,
                    locationId,
                    responsibleRegistration: responsibleRegistration,
                    projectId,
                    imageName: req.file ? req.file.originalname : null
                }
            });

            return res.status(200).json({
                item: updatedItem
            });
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

export { UpdateItemController };