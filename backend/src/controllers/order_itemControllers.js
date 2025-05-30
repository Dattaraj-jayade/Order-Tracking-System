import * as order_itemService from "../services/order_itemServices.js";
import { query } from '../db.js'
export const getorder_items = async (req, res) => {
    try {
        const order_items = await order_itemService.getOrder_items();
        res.status(200).json(order_items);
    } catch (err) { 
        console.error('Error fetching order_items:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


export const createOrder_items = async (req, res) => {
  const customerId = req.params.customerId;
  const { product_size, quantity_kg } = req.body;

  try {
    // 🔍 Step 1: Get the latest order for this customer
    const orderResult = await query(
      `SELECT id FROM orders WHERE customer_id = $1 ORDER BY created_at DESC LIMIT 1`,
      [customerId]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'No order found for this customer' });
    }

    const order_id = orderResult.rows[0].id;

    // ✅ Step 2: Add order_item with that order_id
    const order_item = await order_itemService.createOrder_item({
      order_id,
      product_size,
      quantity_kg,
    });

    res.status(201).json(order_item);
  } catch (error) {
    console.error('❌ Error creating order_items:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateOrder_items = async (req, res) => {
    try {
        const order_itemId = req.params.id;
        const order_itemsData=req.body;
        const updateOrder_items = await order_itemService.updateOrder_items(order_itemId,order_itemsData);
        if (!updateOrder_items) {
            return res.status(404).json({ message: 'Client not found' });
        }
        res.status(200).json(updateOrder_items);
    } catch (err) { 
        console.error('Error fetching order_items:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
export const deleteOrder_items = async (req, res) => {
    try {
         const order_itemId = req.params.id;
        const deleted = await order_itemService.deleteOrder_items(order_itemId);
        if (!deleted) {
        return res.status(404).json({ message: 'Client not found' });
        }
         res.status(200).send();

    } catch (err) { 
        console.error('Error deliting order_item :', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};