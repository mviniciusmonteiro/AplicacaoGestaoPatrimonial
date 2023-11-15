import { NextFunction, Request, Response } from "express";

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class ValidateRecoveryCode {
    async handle(req: Request | any, res: Response, next: NextFunction) {
        try {
            const toValidateRecoveryCode = req.body.code;
            const tokenOnCookie = req.cookies.recovery_token;
            
            if (!toValidateRecoveryCode) {
                return res.status(400).json({mensagem: "O código de recuperação de senha deve ser informado"});
            }

            if (!tokenOnCookie) {
                return res.status(403).json({mensagem: "Acesso não autorizado: código de recuperação de senha é inválido. Para tentar novamente solicite um novo código"});
            }

            // Validando código de recuperação de senha
            const recoveryTokenData = jwt.verify(tokenOnCookie, process.env.JWT_SECRET_KEY);
            const codeIsValid = await bcrypt.compare(toValidateRecoveryCode, recoveryTokenData.code);
            if (codeIsValid) {
                req.userId = recoveryTokenData.id;
                next();
            } else {
                return res.clearCookie("recovery_token").status(403).json({mensagem: "Acesso não autorizado: código de recuperação de senha é inválido. Para tentar novamente solicite um novo código"});
            }
        } catch (error) {
            console.error(error);
            throw(error);
        }
    }
}

export { ValidateRecoveryCode }