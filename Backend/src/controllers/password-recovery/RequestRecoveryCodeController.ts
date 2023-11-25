import { Request, Response } from "express";
import { database } from "../../database";
import { transporter } from '../../config/transporter';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class RequestRecoveryCodeController {
    async handle(req: Request, res: Response) {
        try {
            const { username, email } = req.body;

            if (!(username && email)) {
                return res.status(400).json({mensagem: "Nome de usuário e email são obrigatórios"});
            }

            // Validando username
            const user = await database.user.findFirst({
                where: {
                    username: { equals: username, mode: 'insensitive' }
                }
            });

            if (!user) {
                return res.status(400).json({mensagem: "Nome de usuário ou email não corresponde aos dados cadastrados"});
            }

            // Validando email
            const employee = await database.employee.findFirst({
                where: {
                    registration: user.employeeRegistration,
                    email: { equals: email, mode: 'insensitive' }
                }
            });

            if (!employee) {
                return res.status(400).json({mensagem: "Nome de usuário ou email não corresponde aos dados cadastrados"});                
            }

            // Gera código de recuperação
            const recoveryCode = () => {
                let code = "";
                for (let i=0; i<6; i++) {
                    let randNumber = Math.floor(Math.random() * 10);
                    code += randNumber.toString();
                }
                return code;
            }
            const code = recoveryCode();
            // Criptografando código (hash)
            const salt = await bcrypt.genSalt(10);
            const hashedCode = await bcrypt.hash(code, salt);

            // Enviando código para email do usuário
            const recoveryCodeDuration = Number(process.env.RECOVERY_CODE_DURATION);
            const mailOptions = {
                from: process.env.SUPER_EMAIL,
                to: employee.email,
                subject: 'Recuperação de Senha - GuardeiUFC',
                html: "<p>Prezado (a), <b>" + employee.name.toUpperCase() +  "</b>,<br><br>seu código de recuperação de senha é <b>" + code + "</b> e expira em <b>" + (recoveryCodeDuration/60).toString() +" minutos</b>.<br><br>Se você <b>não</b> solicitou recuperação de senha, por favor <b>não repasse</b> esse código a ninguém!<br><br>" + "<b>Este é um email automático, por favor não responda.<b/>"
            };

            await transporter.sendMail(mailOptions, function(error: Error) {
                if (error) {
                    return res.status(500).json({mensagem: "Ocorreu um erro interno inesperado. Tente novamente mais tarde"});
                } else {
                    const recovery_token = jwt.sign(
                        {id: user.id, code: hashedCode},
                        process.env.JWT_SECRET_KEY,
                        { expiresIn: recoveryCodeDuration }
                    );

                    // Salvando nos cookies
                    return res.cookie('recovery_token', recovery_token, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === "production"
                    }).status(200).json({mensagem: "Código de recuperação gerado com sucesso"});
                }
            });
        } catch (error) {
            console.error(error);
            throw(error);
        }
    }
}

export { RequestRecoveryCodeController }