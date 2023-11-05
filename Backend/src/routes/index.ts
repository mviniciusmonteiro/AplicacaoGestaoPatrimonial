import { Router } from "express";
import { CreateUserController } from "../controllers/user/CreateUserController";
import { LoginController } from "../controllers/user/LoginController";
import { AuthorizationJWTCommom } from "../middleware/AuthorizationJWTCommom";
import { LogoffController } from "../controllers/user/LogoffController";
import { CreateItemController } from "../controllers/item/CreateItemController";
import { AuthorizationJWTAdmin } from "../middleware/AuthorizationJWTAdmin";
import { GetItemByNumberOfPatrimony } from "../controllers/item/GetItemByNumberOfPatrimonyController";
import { DeleteItemController } from "../controllers/item/DeleteItemController";
import { UpdateItemController } from "../controllers/item/UpdateItemController";
import { GetItemsReportController } from "../controllers/report/item/GetItemsReportController";

const router = Router();
const multer = require('multer');
const upload = multer({dest: './src/upload'});

// Rotas públicas (não requerem autorização)
router.post('/user', new CreateUserController().handle);
router.post('/login', new LoginController().handle);

// Rotas que requerem autorização comum
router.get('/logout', new AuthorizationJWTCommom().handle, new LogoffController().handle);
router.put('/item/:numberOfPatrimony', new AuthorizationJWTCommom().handle, upload.single('image'), new UpdateItemController().handle);
router.get('/report/items', new AuthorizationJWTCommom().handle, new GetItemsReportController().handle);

// Rotas que requerem autorização de administrador
router.post('/item', new AuthorizationJWTAdmin().handle, upload.single('image'), new CreateItemController().handle);
router.get('/item/:numberOfPatrimony', new AuthorizationJWTAdmin().handle, new GetItemByNumberOfPatrimony().handle);
router.delete('/item/:numberOfPatrimony', new AuthorizationJWTAdmin().handle, new DeleteItemController().handle);

export { router };