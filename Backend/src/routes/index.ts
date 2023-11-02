import { Router } from "express";
import { CreateUserController } from "../controllers/user/CreateUserController";
import { LoginController } from "../controllers/user/LoginController";
import { CreateItemController } from "../controllers/item/CreateItemController";

const router = Router();

router.post('/user', new CreateUserController().handle);
router.post('/login', new LoginController().handle);

// TODO: Inserir middleware de administrador
router.post('/item', new CreateItemController().handle);

export { router };