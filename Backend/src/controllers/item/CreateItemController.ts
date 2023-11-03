import { Request, Response } from 'express';
import { database } from '../../database';

const utils = require('../../utils/index.js');

class CreateItemController {
    async handle(req: Request | any, res: Response) {
        try {
            const { numberOfPatrimony, name, description, localization, hasResponsible, responsibleRegistration, isOnProject, projectName } = req.body;

            if (!(numberOfPatrimony && name && description && localization && (hasResponsible != undefined)  && (isOnProject != undefined))) {
                return res.status(400).send("Os campos número de patrimônio, nome, descrição, localização, temResponsável e estaEmProjeto são obrigatórios");
            }

            // Variáveis com os tipos definidos (necessário pois, nesse caso, como há um arquivo, os dados do body são passados por form-data - que tipa tudo como string)
            let _numberOfPatrimony = Number(numberOfPatrimony);
            let _hasResponsible = Boolean(hasResponsible);
            let _responsibleRegistration = Number(responsibleRegistration);
            let _isOnProject = Boolean(isOnProject);

            // Verificando se há item com mesmo número de patrimônio
            const itemAlreadyExist = await database.item.findUnique({
                where: {
                    numberOfPatrimony: _numberOfPatrimony
                }
            });

            if (itemAlreadyExist) {
                return res.status(400).send("Já existe um item com mesmo número de patrimônio");
            }

            // Verificando se há um responsável e se sua matrícula é válida
            if (hasResponsible) {
                const registrationIsValid = database.user.findFirst({
                    where: {
                        userRegistration: _responsibleRegistration
                    }
                });

                if (!registrationIsValid) {
                    return res.status(400).send("A matrícula do responsável pelo item é inválida");
                }
            }

            let newImage = null;

            if (req.file) {
                // Lendo o arquivo salvo na pasta src/upload
                let fileContent = utils.base64_encode(req.file.filename);

                // Salvando arquivo no banco
                newImage = await database.image.create({
                    data: {
                        fileName: req.file.originalname,
                        fileExt: req.file.mimetype,
                        file: fileContent
                    }
                });
            }

            // Cadastrando informações do item
            const newItem = await database.item.create({
                data: {
                    numberOfPatrimony: _numberOfPatrimony,
                    name,
                    description,
                    localization,
                    hasResponsible: _hasResponsible,
                    responsibleRegistration: _hasResponsible ? _responsibleRegistration : null,
                    isOnProject: _isOnProject,
                    projectName: _isOnProject ? projectName : null,
                    imageId: newImage == null ? null : newImage.id
                }
            }).then((newItem) => {
                return res.status(201).json({
                    "item": newItem
                });
            });
        } catch (error) {
            throw error;
        }
    }
}

export { CreateItemController };