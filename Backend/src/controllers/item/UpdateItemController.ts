import { Request, Response } from "express";
import { database } from "../../database";

const fs = require('fs');

class UpdateItemController {
    async handle(req: Request | any, res: Response) {
        try {
            let numberOfPatrimonyParam = req.params.numberOfPatrimony;
            let coordinatorRegistration = null; // Matrícula do coordenador do projeto
            
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

            const oldItem = await database.item.findUnique({
                where: { numberOfPatrimony: numberOfPatrimonyParam }
            });

            if (!oldItem) {
                return res.status(400).json({mensagem: "Item do patrimônio não encontrado"});
            }            

            // Verificando se id do local é válido
            const localIsValid = await database.local.findUnique({
                where: {
                    id: locationId
                }
            });
            
            if (!localIsValid) {
                return res.status(400).json({mensagem: "O id do local é inválido"});
            }            

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
            } else {
                // Verificando se item está vinculado a projeto e se id do projeto é válido
                if (projectId) {
                    const projectIsValid = await database.project.findUnique({
                        where: {
                            id: projectId
                        }
                    });

                    if (!projectIsValid) {
                        return res.status(400).json({mensagem: "O id do projeto ao qual item está vinculado é inválido"});
                    } else {
                        coordinatorRegistration = projectIsValid.coordinateRegistration;
                    }
                }
            }

            if (req.file?.originalname != oldItem.imageName) {
                // Usuário enviou uma imagem
                // Apaga imagem antiga e multer irá inserir a nova
                if (oldItem.imageName)
                    fs.unlinkSync(process.env.UPLOADS_PATH + '/images/' + oldItem.imageName);
            }

            // Atualizando dados do item
            const updatedItem = await database.item.update({
                where: { numberOfPatrimony: Number(numberOfPatrimonyParam) },
                data: {
                    name,
                    description,
                    locationId,
                    responsibleRegistration: coordinatorRegistration ? coordinatorRegistration : responsibleRegistration,
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