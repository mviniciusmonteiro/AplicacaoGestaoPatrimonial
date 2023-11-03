import { Router } from "express";
import { CreateUserController } from "../controllers/user/CreateUserController";
import { LoginController } from "../controllers/user/LoginController";
import { AuthorizationJWTCommom } from "../middleware/AuthorizationJWTCommom";
import { LogoffController } from "../controllers/user/LogoffController";
import { SetUserRole } from "../middleware/SetUserRole";

const router = Router();

// Rotas públicas (não requerem autorização)
router.post('/login', new LoginController().handle);

// Rotas públicas, mas que mudam de comportamento dependendo se usuário está ou não logado
router.post('/user', new SetUserRole().handle, new CreateUserController().handle);

// Rotas que requerem autorização comum
router.get('/logout', new AuthorizationJWTCommom().handle, new LogoffController().handle);

// Rotas que requerem autorização de administrador

export { router };