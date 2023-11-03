import { Router } from "express";
import { CreateUserController } from "../controllers/user/CreateUserController";
import { LoginController } from "../controllers/user/LoginController";
import { AuthorizationJWTCommom } from "../middleware/AuthorizationJWTCommom";
import { LogoffController } from "../controllers/user/LogoffController";
import { CreateItemController } from "../controllers/item/CreateItemController";
import { AuthorizationJWTAdmin } from "../middleware/AuthorizationJWTAdmin";

const router = Router();
const multer = require('multer');
const upload = multer({dest: './src/upload'});

// Rotas públicas (não requerem autorização)
router.post('/user', new CreateUserController().handle);
router.post('/login', new LoginController().handle);

// Rotas que requerem autorização comum
router.get('/logout', new AuthorizationJWTCommom().handle, new LogoffController().handle);

// Rotas que requerem autorização de administrador
router.post('/item', new AuthorizationJWTAdmin().handle, upload.single('image'), new CreateItemController().handle);

export { router };