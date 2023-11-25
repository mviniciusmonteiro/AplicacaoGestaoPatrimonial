import { Request, Response } from "express";

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class ValidateRecoveryCodeController {
    async handle(req: Request | any, res: Response) {
        try {
            const toValidateRecoveryCode = req.body.code;
            const tokenOnCookie = req.cookies.recovery_token;
            
            if (!toValidateRecoveryCode) {
                return res.status(400).json({mensagem: "O código de recuperação de senha deve ser informado"});
            }

            if (!tokenOnCookie) {
                return res.status(400).json({mensagem: 'Código de recuperação informado é inválido. Para tentar novamente solicite um novo código'});
            }

            // Validando código de recuperação de senha
            const recoveryTokenData = jwt.verify(tokenOnCookie, process.env.JWT_SECRET_KEY);
            const codeIsValid = await bcrypt.compare(toValidateRecoveryCode, recoveryTokenData.code);
            if (codeIsValid) {
                // Adiciona token validado e exclui token antigo
                const valid_recovery_token = jwt.sign(
                    {id: recoveryTokenData.id, code: recoveryTokenData.code},
                    process.env.JWT_SECRET_KEY
                );
                res.clearCookie('recovery_token');
                return res.cookie('valid_recovery_token', valid_recovery_token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production"
                }).status(200).json({mensagem: "Código de recuperação informado é válido"});
            } else {
                return res.clearCookie('recovery_token').status(403).json({mensagem: 'Código de recuperação informado é inválido. Para tentar novamente solicite um novo código'});
            }
        } catch (error) {
            if (error instanceof Error && error.name === 'TokenExpiredError') {
                return res.clearCookie('recovery_token').status(400).json({mensagem: 'Código de recuperação expirou. Para tentar novamente solicite um novo código'});
            }
            console.error(error);
            throw(error);
        }
    }
}

export { ValidateRecoveryCodeController }