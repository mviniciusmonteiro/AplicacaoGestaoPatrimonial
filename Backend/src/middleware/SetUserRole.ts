import { NextFunction, Response, Request } from 'express';

const jwt = require('jsonwebtoken');

// Middleware não impede acesso quando a rota não está sendo acessada por um usuário logado. Apenas verifica isso e se verdadeiro, seta papel/função para commom. Caso contrário, seta papel/função de acordo com o token.
class SetUserRole {
    handle(req: Request | any, res: Response, next: NextFunction) {
        const token = req.cookies.access_token;

        if (!token) {
            req.userRole = "commom";
        } else {
            const data = jwt.verify(token, process.env.JWT_SECRET_KEY);
            req.userId = data.id;
            req.userRole = data.role;
        }
        next();
    }
}

export { SetUserRole };