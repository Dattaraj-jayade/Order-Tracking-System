import * as OrderService from "../services/orderServices.js";
export const getOrders = async (req, res) => {
    try {
        const Orders = await OrderService.getOrders();
        res.status(200).json(Orders);
    } catch (err) {
        console.error('Error fetching Orders:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
export const createOrder = async (req, res) => {
  try {
    const { customerId } = req.params;
    const orderData = { ...req.body, customer_id: customerId };
    const newOrder = await OrderService.createOrder(orderData)
    res.status(201).json(newOrder)
  } catch (err) {
    console.error("Error creating order:", err)
    res.status(500).json({ message: "Internal Server Error" })
  }
}

export const updateOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        const orderData = req.body;
        const updateOrder = await OrderService.updateOrder(orderId, orderData);
        if (!updateOrder) {
            return res.status(404).json({ message: 'order not found' });
        }
        res.status(200).json(updateOrder);
    } catch (err) {
        console.error('Error updateing Order:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const deleteOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        const deleted = await OrderService.deleteOrder(orderId);
        if (!deleted) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(updateOrder);
    } catch (err) {
        console.error('Error Deleteing Order:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// export const getById = async (req, res) => {
//     try {
//         const Orders = await OrderService.getById();
//         res.status(200).json(Orders);
//     } catch (err) {
//         console.error('Error fetching Orders:', err);
//         res.status(500).json({ message: 'Internal Server Error' });
//     }
// };

export const getById = async (req, res) => {
  try {
    const { id } = req.params;                        // ← grab the id
    const order = await OrderService.getById(id);     // ← pass it in
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (err) {
    console.error('Error fetching order:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};