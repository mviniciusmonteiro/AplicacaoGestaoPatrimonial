import { Request, Response } from "express";
import { database } from "../../../database";

class GetItemsReportController {
    async handle(req: Request | any, res: Response) {/*
        try {
            const { numberOfPatrimony, name, description, localization, hasResponsible, responsibleRegistration, isOnProject, projectName } = req.body;

            if (!(numberOfPatrimony != undefined && name != undefined && description != undefined && localization != undefined && hasResponsible != undefined && responsibleRegistration != undefined && isOnProject != undefined && projectName != undefined)) {
                return res.status(400).json({mensagem: "Os campos número do patrimônio, nome, descrição, localização, tem responsável, matrícula do responsável, está em projeto e nome do projeto são obrigatórios"});
            }

            // Filtrando os campos booleanos
            let filteredItems = await database.item.findMany({
                where: {
                    id: {gt: 0} // Retorna os itens com id > 0
                }
            });

            if (!filteredItems) {
                return res.status(200).json({});
            }

            // Filtrando parâmetros booleanos
            if (hasResponsible.toLowerCase() != "todos" && req.userRole == "admin") {
                // Filtra de acordo com o parâmetro do filtro
                filteredItems = filteredItems.filter((item) => {
                    const filterParam = hasResponsible.toLowerCase() == "sim" ? true : false;
                    return (item.hasResponsible == filterParam);
                });
            }
            if (isOnProject.toLowerCase() != "todos") {
                // Filtra de acordo com o parâmetro do filtro
                filteredItems = filteredItems.filter((item) => {
                    const filterParam = isOnProject.toLowerCase() == "sim" ? true : false;
                    return (item.isOnProject == filterParam);
                });
            }

            // Filtrando parâmetro inteiro (número de patrimônio)
            if (numberOfPatrimony != "") {
                const numberPatrimonyInt = Number(numberOfPatrimony);

                filteredItems = filteredItems.filter((item) => {
                    return (item.numberOfPatrimony == numberPatrimonyInt);
                });
            }

            // Filtrando parâmetro inteiro (matrícula do responsável)
            if (req.userRole == "commom") {
                const userLogged = await database.user.findUnique({
                    where: {
                        id: req.userId
                    }
                });

                const loggedUserRegist = userLogged?.userRegistration;
                // Filtra apenas itens que usuário logado é responsável
                filteredItems = filteredItems.filter((item) => {
                    return (item.responsibleRegistration == loggedUserRegist);
                });
            } else if (responsibleRegistration != "") {
                // Filtra quaisquer itens
                const registrationInt = Number(responsibleRegistration);

                filteredItems = filteredItems.filter((item) => {
                    return (item.responsibleRegistration == registrationInt);
                });
            }

            // Filtrando parâmetro de string definido como possivelmente null no prisma schema
            if (projectName != "") {
                filteredItems = filteredItems.filter((item) => {
                    return item.projectName?.toLowerCase().includes(projectName.toLowerCase());
                });
            }

            // Filtrando parâmetros de string
            filteredItems = filteredItems.filter((item) => {
                // Nota: includes realiza uma busca por correspondência parcial ("teste".includes("tes") retorna true)
                return (item.name.toLowerCase().includes(name.toLowerCase()) && item.description.toLowerCase().includes(description.toLowerCase()) && item.localization.toLowerCase().includes(localization.toLowerCase()));
            });
            return res.status(200).json({
                itens: filteredItems
            });
        } catch (error) {
            console.error(error);
            throw error;
        }*/
    }
}

export { GetItemsReportController }