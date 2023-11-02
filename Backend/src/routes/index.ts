import { Router } from "express";
import { CreateUserController } from "../controllers/user/CreateUserController";
import { LoginController } from "../controllers/user/LoginController";

const router = Router();

router.post('/user', new CreateUserController().handle);
router.post('/login', new LoginController().handle);

export { router };