import { Request, Response } from "express";
import { database } from "../../../database";

class GetItemsReportController {
    async handle(req: Request | any, res: Response) {
        try {
            let { numberOfPatrimony, name, description, locationId, status, responsibleRegistration, projectId } = req.body;

            let filteredItems = await database.item.findMany({
                where: {
                    id: {gt: 0} // Retorna os itens com id > 0 (todos os itens)
                }
            });

            if (!filteredItems) {
                return res.status(200).json({mensagem: "Nenhum item cadastrado"});
            }

            // Filtrando por número de patrimônio (correspondência exata)
            if (numberOfPatrimony) {
                filteredItems = filteredItems.filter((item) => {
                    return (item.numberOfPatrimony == numberOfPatrimony);
                });
            }

            // Matrícula do responsável (correspondência exata)
            if (responsibleRegistration) {
                filteredItems = filteredItems.filter((item) => {
                    if (req.userRole == "commom") {
                        return (item.responsibleRegistration == req.userId); // Usuário comum só pode filtrar itens que ele é responsável
                    }
                    return (item.responsibleRegistration == responsibleRegistration);
                });
            }

            // Localização (correspondência exata com base no id do lugar)
            if (locationId) {
                filteredItems = filteredItems.filter((item) => {
                    return (item.locationId == locationId);
                });
            }

            // Nome do projeto (correspondência exata com base no id do projeto)
            if (projectId) {
                filteredItems = filteredItems.filter((item) => {
                    return (item.projectId == projectId);
                });
            }

            // Status (1: alocado a funcionário/projeto; 2: disponível; e 3: todos)
            if (status == 1) {
                // Filtrar projetos que estão vinculados a funcionário ou projeto
                filteredItems = filteredItems.filter((item) => {
                    return (item.responsibleRegistration != null || item.projectId != null);
                });
            } else if (status == 2) {
                // Filtrar projetos que não estão vinculados a funcionário nem a projeto
                filteredItems = filteredItems.filter((item) => {
                    return (item.responsibleRegistration == null && item.projectId == null);
                });
            }

            // Nome do projeto (correspondência parcial sem diferencias maiúsculas e minúsculas)
            if (name) {
                filteredItems = filteredItems.filter((item) => {
                    return (item.name.toLowerCase().includes(name.toLowerCase()));
                });
            }
            
            // Descrição (correspondência parcial sem diferencias maiúsculas e minúsculas)
            if (description) {
                filteredItems = filteredItems.filter((item) => {
                    return (item.description.toLowerCase().includes(description.toLowerCase()));
                });
            }

            /*
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
            });*/
            return res.status(200).json({
                itens: filteredItems
            });
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

export { GetItemsReportController }