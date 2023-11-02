import { Request, Response } from 'express';
import { database } from '../../database';


class CreateItemController {
    async handle(request: Request, response: Response) {
        try {
            const { numberOfPatrimony, name, description, localization, hasResponsible, responsibleRegistration, isOnProject, projectName, pathImage } = request.body;

            if (!(numberOfPatrimony && name && description && localization && (hasResponsible != undefined)  && (isOnProject != undefined))) {
                return response.status(400).send("Os campos número de patrimônio, nome, descrição, localização, temResponsável e estaEmProjeto são obrigatórios");
            }

            // Verificando se há item com mesmo número de patrimônio
            const itemAlreadyExist = await database.item.findUnique({
                where: {
                    numberOfPatrimony
                }
            });

            if (itemAlreadyExist) {
                return response.status(400).send("Já existe um item com mesmo número de patrimônio");
            }

            // Verificando se há um responsável e se sua matrícula é válida
            if (hasResponsible) {
                const registrationIsValid = database.user.findFirst({
                    where: {
                        userRegistration: responsibleRegistration
                    }
                });

                if (!registrationIsValid) {
                    return response.status(400).send("A matrícula do responsável pelo item é inválida");
                }
            }

            if (pathImage != undefined && pathImage != "") {
                // TODO: cadastrar imagem
            }

            // Cadastrando informações do item
            const newItem = await database.item.create({
                data: {
                    numberOfPatrimony,
                    name,
                    description,
                    localization,
                    hasResponsible,
                    responsibleRegistration: hasResponsible ? responsibleRegistration : null,
                    isOnProject,
                    projectName: isOnProject ? projectName : null,
                    imageId: null // TODO: alterar após cadastrar imagem
                }
            }).then((newItem) => {
                return response.status(201).json({
                    "item": newItem
                });
            });
        } catch (error) {
            throw error;
        }
    }
}

export { CreateItemController };