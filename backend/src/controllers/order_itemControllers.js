import * as order_itemService from "../services/order_itemServices.js";
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
    try {
        const order_itemsData=req.body;
        const Neworder_items = await order_itemService.createOrder_item(order_itemsData);
        res.status(200).json(Neworder_items);
    } catch (err) { 
        console.error('Error fetching order_items:', err);
        res.status(500).json({ message: 'Internal Server Error' });
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