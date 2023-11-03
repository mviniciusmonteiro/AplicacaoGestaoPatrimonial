import { Request, Response } from "express";

class LogoffController {
    handle(req: Request, res: Response) {
        return res.clearCookie("acces_token").status(200).json({mensagem: "Logoff realizado com sucesso"});
    }
}

export { LogoffController };