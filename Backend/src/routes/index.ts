import { Router } from "express";
import { CreateUserController } from "../controllers/user/CreateUserController";
import { LoginController } from "../controllers/user/LoginController";
import { AuthorizationJWTCommom } from "../middleware/AuthorizationJWTCommom";
import { LogoffController } from "../controllers/user/LogoffController";
import { CreateItemController } from "../controllers/item/CreateItemController";

const router = Router();

// Rotas públicas (não requerem autorização)
router.post('/user', new CreateUserController().handle);
router.post('/login', new LoginController().handle);

// Rotas que requerem autorização comum
router.get('/logout', new AuthorizationJWTCommom().handle, new LogoffController().handle);

// Rotas que requerem autorização de administrador
// TODO: Inserir middleware de administrador
router.post('/item', new CreateItemController().handle);

export { router };