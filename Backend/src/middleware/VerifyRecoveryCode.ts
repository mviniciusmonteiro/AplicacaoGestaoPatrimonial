import { NextFunction, Request, Response } from "express";

const jwt = require('jsonwebtoken');

class VerifyRecoveryCode {
    async handle(req: Request | any, res: Response, next: NextFunction) {
        try {
            const tokenOnCookie = req.cookies.valid_recovery_token;
            
            if (!tokenOnCookie) {
                return res.status(403).json({mensagem: "Acesso não autorizado: valide o código de recuperação antes de tentar alterar a senha"});
            }
            const tokenOnCookieData = jwt.verify(tokenOnCookie, process.env.JWT_SECRET_KEY);
            req.userId = tokenOnCookieData.id;
            next();
        } catch (error) {
            console.error(error);
            throw(error);
        }
    }
}

export { VerifyRecoveryCode }