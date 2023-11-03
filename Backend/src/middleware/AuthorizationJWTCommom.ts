import { NextFunction, Request, Response } from "express";

const jwt = require('jsonwebtoken');

// Autorização comum: apenas verifica se há um token válido (não verifica se usuário é administrador)
class AuthorizationJWTCommom {
    handle(req: Request | any, res: Response, next: NextFunction) {
        const token = req.cookies.access_token;

        if (!token) {
            return res.status(403).json({mensagem: "Acesso não autorizado"});
        }
        try {
            // Validando token
            const data = jwt.verify(token, process.env.JWT_SECRET_KEY);
            req.userId = data.id;
            req.userRole = data.role;
            return next();
        } catch (error) {
            return res.status(403).json({mensagem: "Acesso não autorizado"});    
        }
    }
}

export { AuthorizationJWTCommom }