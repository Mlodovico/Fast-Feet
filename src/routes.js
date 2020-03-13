import { Router } from 'express';
import multer from 'multer';

import UserController from './app/controller/UserController';
import SessionController from './app/controller/SessionController';
import RecipientController from './app/controller/RecipientController';
import DeliveryController from './app/controller/DeliveryController';
import FileController from './app/controller/FileController';
import OrderController from './app/controller/OrderController';
import StartOfDay from './app/controller/StartDateDeliveryController';
import EndOfDay from './app/controller/EndDateDeliveryController';
import DeliveryManOrderController from './app/controller/DeliveryManOrderController';
import DeliveryProblemController from './app/controller/DeliveryProblemController';

import authMiddleware from './app/middleware/auth';
import multerConfig from './config/multer';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/sessions', SessionController.store);

routes.post('/users', UserController.store);

routes.get('/delivery/:id/deliveries', DeliveryManOrderController.index);
routes.put('/delivery/:id/deliveries/:orderId', DeliveryManOrderController.update);

routes.post('/delivery/:deliveryId/problem', DeliveryProblemController.store);
routes.get('/delivery/:id/problem', DeliveryProblemController.index);
routes.delete('/delivery/:id/cancel-delivery', DeliveryProblemController.delete);


routes.use(authMiddleware);

routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:id', RecipientController.update);

routes.put('/users/:id', UserController.update);

routes.post('/deliverys', DeliveryController.store);
routes.get('/deliverys', DeliveryController.index);
routes.put('/deliverys/:id', DeliveryController.update);
routes.delete('/deliverys/:id', DeliveryController.delete);

routes.post('/orders', OrderController.store);
routes.get('/orders', OrderController.index);
routes.delete('/orders/:id', OrderController.delete);

routes.put('/orders/startday/:delivery_id/:deliveryman_id', StartOfDay.update);
routes.put('/orders/endday/:delivery_id/:deliveryman_id', EndOfDay.update);

 routes.post('/files', upload.single('file'), FileController.store);


export default routes;