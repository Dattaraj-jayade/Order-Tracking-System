import express from 'express';
import * as orderController from '../controllers/orderControllers.js'

const router = express.Router();

router.get('/Ordes', orderController.getOrders);
router.post('/Ordes/:customerId', orderController.createOrder);
router.put('/Ordes/:id', orderController.updateOrder);
router.delete('/Ordes/:id', orderController.deleteOrder);
router.get('/Orders/:id', orderController.getById);
export default router;