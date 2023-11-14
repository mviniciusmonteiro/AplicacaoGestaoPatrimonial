import { Router } from "express";
import { CreateUserControllerCommom } from "../controllers/user/CreateUserControllerCommom";
import { CreateUserControllerAdmin } from "../controllers/user/CreateUserControllerAdmin";
import { LoginController } from "../controllers/user/LoginController";
import { AuthorizationJWTCommom } from "../middleware/AuthorizationJWTCommom";
import { LogoffController } from "../controllers/user/LogoffController";
import { CreateItemController } from "../controllers/item/CreateItemController";
import { AuthorizationJWTAdmin } from "../middleware/AuthorizationJWTAdmin";
import { GetItemByNumberOfPatrimony } from "../controllers/item/GetItemByNumberOfPatrimonyController";
import { DeleteItemController } from "../controllers/item/DeleteItemController";
import { UpdateItemController } from "../controllers/item/UpdateItemController";
import { GetItemsReportController } from "../controllers/report/item/GetItemsReportController";
import { CreateLocalController } from "../controllers/local/CreateLocalController";
import { GetLocalById } from "../controllers/local/GetLocalByIdController";
import { GetAllLocationsController } from "../controllers/local/GetAllLocationsController";
import { UpdateLocalController } from "../controllers/local/UpdateLocalController";
import { DeleteLocalController } from "../controllers/local/DeleteLocalController";
import { CreateProjectController } from "../controllers/project/CreateProjectController";
import { GetProjectById } from "../controllers/project/GetProjectByIdController";
import { UpdateProjectController } from "../controllers/project/UpdateProjectController";
import { DeleteProjectController } from "../controllers/project/DeleteProjectController";
import { GetAllProjectsController } from "../controllers/project/GetAllProjectsController";
import { UpdateUserController } from "../controllers/user/UpdateUserController";
import { GetUserByUsernameController } from "../controllers/user/GetUserByUsernameController";
import { GetAllUsersController } from "../controllers/user/GetAllUsersController";
import { DeleteUserController } from "../controllers/user/DeleteUserController";

const router = Router();
const multer = require('../config/multer');

// Rotas públicas (não requerem autorização)
router.post('/login', new LoginController().handle);
router.post('/sign-up', new CreateUserControllerCommom().handle);
router.get('/local', new GetAllLocationsController().handle);
router.get('/project', new GetAllProjectsController().handle);

// Rotas que requerem autorização comum (apenas autenticado)
router.get('/logout', new AuthorizationJWTCommom().handle, new LogoffController().handle);
router.get('/report/items', new AuthorizationJWTCommom().handle, new GetItemsReportController().handle);
router.put('/user/:username?', new AuthorizationJWTCommom().handle, new UpdateUserController().handle);

// Rotas que requerem autorização de administrador (autenticado e administrador)
router.post('/user', new AuthorizationJWTAdmin().handle, new CreateUserControllerAdmin().handle);
router.get('/user/:username', new AuthorizationJWTAdmin().handle, new GetUserByUsernameController().handle);
router.get('/user', new AuthorizationJWTAdmin().handle, new GetAllUsersController().handle);
router.delete('/user/:username', new AuthorizationJWTAdmin().handle, new DeleteUserController().handle);
router.post('/item', new AuthorizationJWTAdmin().handle, multer.uploadImage.single('image'), new CreateItemController().handle);
router.get('/item/:numberOfPatrimony', new AuthorizationJWTAdmin().handle, new GetItemByNumberOfPatrimony().handle);
router.put('/item/:numberOfPatrimony', new AuthorizationJWTAdmin().handle, multer.uploadImage.single('image'), new UpdateItemController().handle);
router.delete('/item/:numberOfPatrimony', new AuthorizationJWTAdmin().handle, new DeleteItemController().handle);
router.post('/local', new AuthorizationJWTAdmin().handle, new CreateLocalController().handle);
router.get('/local/:locationId', new AuthorizationJWTAdmin().handle, new GetLocalById().handle);
router.put('/local/:locationId', new AuthorizationJWTAdmin().handle, new UpdateLocalController().handle);
router.delete('/local/:locationId', new AuthorizationJWTAdmin().handle, new DeleteLocalController().handle);
router.post('/project', new AuthorizationJWTAdmin().handle, new CreateProjectController().handle);
router.get('/project/:projectId', new AuthorizationJWTAdmin().handle, new GetProjectById().handle);
router.put('/project/:projectId', new AuthorizationJWTAdmin().handle, new UpdateProjectController().handle);
router.delete('/project/:projectId', new AuthorizationJWTAdmin().handle, new DeleteProjectController().handle);

export { router };