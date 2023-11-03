import { Request, Response } from "express";
import { database } from "../../database";

const utils = require('../../utils/index.js');

class UpdateItemController {
    async handle(req: Request | any, res: Response) {
        try {
            const numberOfPatrimonyParam = req.params.numberOfPatrimony;
            
            if (!numberOfPatrimonyParam) {
                return res.status(404).send("O número de patrimônio do item deve ser informados");
            }

            const { name, description, localization, hasResponsible, responsibleRegistration, isOnProject, projectName } = req.body;
        
            if (!(name && description && localization && (hasResponsible != undefined)  && (isOnProject != undefined))) {
                return res.status(400).send("Os campos número de patrimônio, nome, descrição, localização, temResponsável e estaEmProjeto são obrigatórios");
            }

            // Variáveis com os tipos definidos (necessário pois, nesse caso, como há um arquivo, os dados do body são passados por form-data - que tipa tudo como string)
            let _hasResponsible = Boolean(hasResponsible);
            let _responsibleRegistration = Number(responsibleRegistration);
            let _isOnProject = Boolean(isOnProject);

            // Verificando se há um responsável e se sua matrícula é válida
            if (hasResponsible) {
                const registrationIsValid = database.user.findFirst({
                    where: {
                        userRegistration: responsibleRegistration
                    }
                });

                if (!registrationIsValid) {
                    return res.status(400).send("A matrícula do responsável pelo item é inválida");
                }
            }            

            const oldItem = await database.item.findUnique({
                where: { numberOfPatrimony: Number(numberOfPatrimonyParam) }
            });

            if (!oldItem) {
                return res.status(400).send("Item do patrimônio não encontrado");
            }

            // Deletando imagem antiga
            if (oldItem.imageId) {
                await database.image.delete({
                    where: { id: Number(oldItem.imageId) }
                });
            }
            let newImage = null;
            // Verificando se imagem será atualizada
            if (req.file) {
                // Lendo os dados da nova imagem salvos na pasta src/upload
                let fileContent = utils.base64_encode(req.file.filename);

                // Salvando imagem no banco
                newImage = await database.image.create({
                    data: {
                        fileName: req.file.originalname,
                        fileExt: req.file.mimetype,
                        file: fileContent
                    }
                });
            }

            // Atualizando dados do item
            const updatedItem = await database.item.update({
                where: { numberOfPatrimony: Number(numberOfPatrimonyParam) },
                data: {
                    numberOfPatrimony: Number(numberOfPatrimonyParam),
                    name: name,
                    description: description,
                    localization: localization,
                    hasResponsible: _hasResponsible,
                    responsibleRegistration: _hasResponsible ? _responsibleRegistration : null,
                    isOnProject: _isOnProject,
                    projectName: _isOnProject ? projectName : null,
                    imageId: newImage == null ? null : newImage.id
                }
            });

            return res.status(200).json({
                item: { updatedItem }
            });
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

export { UpdateItemController };