import { Request, Response } from 'express';
import { database } from '../../database';

class CreateItemController {
    async handle(req: Request | any, res: Response) {
        try {
            let { numberOfPatrimony, name, description, locationId, responsibleRegistration, projectId } = req.body;
            let coordinatorRegistration = null; // Matrícula do coordenador do projeto

            if (!(numberOfPatrimony && name && description && locationId)) {
                return res.status(400).json({mensagem: "Os campos número de patrimônio, nome, descrição e id da localização são obrigatórios"});
            }

            // Variáveis com os tipos definidos (necessário pois, nesse caso, como há um arquivo, os dados do body são passados por form-data - que tipa tudo como string)
            numberOfPatrimony = Number(numberOfPatrimony);
            responsibleRegistration = responsibleRegistration ? Number(responsibleRegistration) : null;
            projectId = projectId ? Number(projectId) : null;
            locationId = Number(locationId);

            // Verificando se há item com mesmo número de patrimônio
            const itemAlreadyExist = await database.item.findUnique({
                where: {
                    numberOfPatrimony: numberOfPatrimony
                }
            });

            if (itemAlreadyExist) {
                return res.status(400).json({mensagem: "Já existe um item com mesmo número de patrimônio"});
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
                        coordinatorRegistration = projectIsValid.coordinatorRegistration;
                    }
                }
            }
            // Cadastrando informações do item
            const newItem = await database.item.create({
                data: {
                    numberOfPatrimony,
                    name,
                    description,
                    locationId,
                    responsibleRegistration: coordinatorRegistration ? coordinatorRegistration : responsibleRegistration,
                    projectId,
                    imageName: req.file ? req.file.filename : null
                }
            });
            return res.status(201).json({
                "item": newItem
            });
        } catch (error) {
            throw error;
        }
    }
}

export { CreateItemController };