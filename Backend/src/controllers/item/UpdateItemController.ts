import { Request, Response } from "express";
import { database } from "../../database";

const utils = require('../../utils/index.js');

class UpdateItemController {
    async handle(req: Request | any, res: Response) {
        try {
            const numberOfPatrimonyParam = req.params.numberOfPatrimony;
            
            if (!numberOfPatrimonyParam) {
                return res.status(404).json({mensagem: "O número de patrimônio do item deve ser informados"});
            }

            const { name, description, localization, hasResponsible, responsibleRegistration, isOnProject, projectName } = req.body;
        
            if (!(name && description && localization && (hasResponsible != undefined)  && (isOnProject != undefined))) {
                return res.status(400).json({mensagem: "Os campos número de patrimônio, nome, descrição, localização, temResponsável e estaEmProjeto são obrigatórios"});
            }

            // Variáveis com os tipos definidos (necessário pois, nesse caso, como há um arquivo, os dados do body são passados por form-data - que tipa tudo como string)
            let _hasResponsible = hasResponsible == "true" ? true : false;
            let _responsibleRegistration = Number(responsibleRegistration);
            let _isOnProject = isOnProject == "true" ? true : false;

            // Verificando se há um responsável e se sua matrícula é válida
            if (_hasResponsible) {
                const registrationIsValid = await database.user.findFirst({
                    where: {
                        userRegistration: _responsibleRegistration
                    }
                });

                if (!registrationIsValid) {
                    return res.status(400).json({mensagem: "A matrícula do responsável pelo item é inválida"});
                }
            }

            const oldItem = await database.item.findUnique({
                where: { numberOfPatrimony: Number(numberOfPatrimonyParam) }
            });

            if (!oldItem) {
                return res.status(400).json({mensagem: "Item do patrimônio não encontrado"});
            }

            const removeOldImage = async (imageId: Number) => {
                console.log("Removi imagem antiga");
                oldImage = await database.image.delete({
                    where: { id: Number(imageId) }
                });
            }

            // Buscando a imagem antiga cadastrada no banco
            let oldImage = null;
            let oldImageName = null;
            if (oldItem.imageId) {
                oldImage = await database.image.findUnique({
                    where: { id: Number(oldItem.imageId) }
                });
                if (oldImage) {
                    oldImageName = oldImage.fileName;
                }
            }

            let newImage = oldImage;
            // Verificando se imagem será atualizada
            if (req.file) {
                // Usuário enviou uma imagem na requisição
                if (oldImageName != req.file.originalname) {
                    // Imagem passada por requisição é diferente da imagem cadastrada antes: atualiza

                    // Remove imagem antiga
                    if (oldImage) {
                        removeOldImage(oldImage.id);
                    }

                    // Salva nova imagem
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
            } else {
                if (oldImage) {
                    removeOldImage(oldImage.id);
                    newImage = null;
                }
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
                    imageId: newImage ? newImage.id : null
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