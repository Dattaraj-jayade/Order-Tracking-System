
import express from 'express';
import * as order_itemsController from '../controllers/order_itemControllers.js'

const router = express.Router();

router.get('/order_items', order_itemsController.getorder_items);
router.post('/order_items/:customerId', order_itemsController.createOrder_items);
router.put('/order_items/:id', order_itemsController.updateOrder_items);
router.delete('/order_items/:id', order_itemsController.deleteOrder_items);



export default router;