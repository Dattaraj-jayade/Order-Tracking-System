import { query } from "../db.js"

import Joi from "joi";

const clientSchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  order_date: Joi.date().required(),
  rate_per_kg: Joi.number().positive().optional(),
  quantity_kg: Joi.number().positive().optional(),
  plate_type: Joi.string().required(),
  // status: Joi.boolean().required(),
  plate_charges : Joi.number().min(0).optional(),
  advance_received: Joi.number().min(0).optional(),
  product_size: Joi.number().positive().optional(),
}).unknown(true);

export const getClients = async () => {
  //const {rows} = await query('SELECT * FROM customers');
  //const {rows} = await query('SELECT order_date,plate_type,status,advance_received FROM orders');
  //const {rows} = await query('SELECT product_size, FROM order_item')
  const { rows } = await query(` 
    SELECT
      c.id                 AS customer_id,
      c.name               AS name,
      o.id                 AS order_id,
      o.order_date         AS order_date,
      o.rate_per_kg        AS rate_per_kg,
      o.plate_charges      AS plate_charges,
      o.plate_type         AS plate_type,
      o.status             AS status,
      o.advance_received   AS advance_received,
      oi.product_size      AS product_size,
      oi.quantity_kg       AS quantity_kg
    FROM customers AS c
    LEFT JOIN orders AS o
      ON o.customer_id = c.id
    LEFT JOIN order_items AS oi
      ON oi.order_id = o.id
    ORDER BY c.id
  `);
  return rows;
}

export const createClient = async (clientData) => {
  const { name, } = clientData;
  const { rows } = await query(`
        INSERT INTO customers(name)
        VALUES($1) RETURNING*`,
    [name]
  );
  return rows[0];
}

// export const createClient = async (clientData) => {
//   try {
//     await query('BEGIN');

//     // 1. Insert into customers
//     const insertCustomerText = `INSERT INTO customers (name) VALUES ($1) RETURNING *`;
//     const customerRes = await query(insertCustomerText, [clientData.name]);
//     const customer = customerRes.rows[0];

//     // 2. Insert into orders
//     const insertOrderText = `
//       INSERT INTO orders (customer_id, order_date, rate_per_kg, plate_type, status, advance_received)
//       VALUES ($1, $2, $3, $4, $5 , $6) RETURNING *
//     `;
//     const orderRes = await query(insertOrderText, [
//       customer.id,
//       clientData.order_date,
//       clientData.rate_per_kg,
//       clientData.plate_type,
//       clientData.status,
//       clientData.advance_received,
//     ]);
//     const order = orderRes.rows[0]; 

//     // 3. Insert multiple order_items (optional)
//     const orderItemsData = [];
//     const orderItems = clientData.order_items || [];

//     for (const item of orderItems) {
//       const itemRes = await query(
//         `INSERT INTO order_items (order_id, product_size, quantity_kg)
//          VALUES ($1, $2, $3) RETURNING *`,
//         [order.id, item.product_size, item.quantity_kg]
//       );
//       orderItemsData.push(itemRes.rows[0]);
//     }

//     await query('COMMIT');

//     return {
//       customer,
//       order,
//       order_items: orderItemsData,
//     };
//   } catch (err) {
//     await query('ROLLBACK');
//     throw err;
//   }
// };


export const updateClient = async (customerId, clientData) => {
  // Validate input
  const { error, value } = clientSchema.validate(clientData);
  if (error) {
    const msg = error.details.map(d => d.message).join(", ");
    const e = new Error(`Invalid client data: ${msg}`);
    e.status = 400;
    throw e;
  }

  const {
    name,
    order_date,
    rate_per_kg,
    quantity_kg,
    plate_type,
    plate_charges,
    status: statusBool,
    advance_received,
    product_size,
  } = value;

  const status = statusBool ? true : false;
  // Start transaction
  await query("BEGIN");

  try {
    // 1. Update customer
    const custRes = await query(
      `UPDATE customers
         SET name = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING id, name`,
      [name, customerId]
    );
    if (custRes.rowCount === 0) {
      await query("ROLLBACK");
      return null; // controller will send 404
    }

    // 2. Update order
    const orderRes = await query(
      `UPDATE orders
         SET order_date = $1,
             rate_per_kg = $2,
             plate_type = $3,
             plate_charges=$4,
              status = $5,  
             advance_received = $6,
             updated_at = NOW()
       WHERE customer_id = $7
       RETURNING id, order_date, rate_per_kg, plate_type,plate_charges, status, advance_received`,
      [order_date, rate_per_kg, plate_type,plate_charges, status, advance_received, customerId]
    );
    if (orderRes.rowCount === 0) {
      await query("ROLLBACK");
      const e = new Error("Order not found for customer");
      e.status = 404;
      throw e;
    }
    const order = orderRes.rows[0];

    // 3. Update item
    const itemRes = await query(
  `UPDATE order_items
     SET product_size = $1,
         quantity_kg  = $2 
   WHERE order_id    = $3
   RETURNING product_size, quantity_kg, order_id, id`,
  [product_size, quantity_kg, order.id]
);

if (itemRes.rowCount === 0) {
  throw new Error(`No order_items row found for order_id=${order.id}`);
}
const updatedItem = itemRes.rows[0];
    // Commit now that everything succeeded.
    await query("COMMIT");

    // 4. Return a combined object
    return {
      customer_id: custRes.rows[0].id,
      name: custRes.rows[0].name,
      ...order,
      ...updatedItem 
    };
  } catch (err) {
    await query("ROLLBACK");
    throw err;
  }
};

export const deleteClient = async (clientId) => {

  try {
    await query('BEGIN');

    // Delete all order_items linked to this customer's orders
    await query(`
      DELETE FROM order_items 
      WHERE order_id IN (
        SELECT id FROM orders WHERE customer_id = $1
      )
    `, [clientId]);

    // Delete all orders for this customer
    await query(`
      DELETE FROM orders 
      WHERE customer_id = $1
    `, [clientId]);

    // Delete the customer itself
    const { rowCount } = await query(`
      DELETE FROM customers 
      WHERE id = $1
    `, [clientId]);

    await query('COMMIT');
    return rowCount > 0; // true only if customer was deleted
  } catch (error) {
    await query('ROLLBACK');
    console.error("Failed to delete client:", error);
    return false;
  }
};




// export const getById = async (id) => {
//   const clientRes = await query(`SELECT * FROM customers WHERE id = $1`, [id]);
//   const client = clientRes.rows[0];
//   if (!client) return null;

//   const orderRes = await query(`SELECT * FROM orders WHERE customer_id = $1`, [id]);
//   const orders = orderRes.rows;
//   if (orders.length === 0) return {
//     ...client,
//     orders: [],
//     items: [],
//     total_amount_receivable: 0,
//     order_date: null,
//     product_size: 0,
//     plate_type: '',
//     status: false,
//     advance_received: 0
//   };

//   const itemsRes = await query(
//     `SELECT * FROM order_items WHERE order_id IN (
//       SELECT id FROM orders WHERE customer_id = $1
//     )`,
//     [id]
//   );
//   const items = itemsRes.rows;

//   // Calculate total for all orders
//   let total = 0;
//   for (const order of orders) {
//     const orderItems = items.filter(i => i.order_id === order.id);
//     const totalQty = orderItems.reduce((sum, i) => sum + Number(i.quantity_kg ?? 0), 0);
//     const rate = Number(order.rate_per_kg ?? 0);
//     const plate = Number(order.plate_charges ?? 0);
//     const advance = Number(order.advance_received ?? 0);
//     total += (rate * totalQty) + plate - advance;
//   }

//   return {
//     ...client, orders, items, total_amount_receivable: total
//   };
// };


export const getById = async (id) => {
  const clientRes= await query( `SELECT name FROM customers WHERE id = $1`, [id]);
  const client = clientRes.rows;
  if (!client)return null;
  const ordersRes = await query(`SELECT id, rate_per_kg, plate_charges, advance_received FROM orders WHERE customer_id = $1`, [id]);
  const orders = ordersRes.rows;
  if (orders.length === 0) return { 
    total_amount_receivable: 0,
      order_date: null,
      product_size: 0,
      plate_type: '',
      status: false,
      advance_received: 0 };

  const orderIds = orders.map(order => `'${order.id}'`).join(',');
  const itemsRes = await query(
    `SELECT order_id, quantity_kg FROM order_items WHERE order_id IN (${orderIds})`
  );
  const items = itemsRes.rows;

  let total = 0;
  const latestOrder = orders[orders.length - 1];
  for (const order of orders) {
    const orderItems = items.filter(i => i.order_id === order.id);
    const totalQty = orderItems.reduce((sum, i) => sum + Number(i.quantity_kg ?? 0), 0);
    const rate = Number(order.rate_per_kg ?? 0);
    const plate = Number(order.plate_charges ?? 0);
    const advance = Number(order.advance_received ?? 0);
    total += (rate * totalQty) + plate - advance;
  }

  return { total_amount_receivable: total 
  };
};

// export const searchClients = async (searchTerm) => {
//     const { rows } = await query(
//      `SELECT * FROM customers 
// LEFT JOIN orders ON customers.customer_id = orders.customer_id
// WHERE customers.name ILIKE $1
//    OR TO_CHAR(orders.order_date AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata', 'DD-MM-YYYY') ILIKE $1`
//       [`%${searchTerm}%`]
//     );
//     return rows;
//   };

export const searchClients = async (searchTerm) => {
  const { rows } = await query(
    `
    SELECT
      c.customer_id,
      c.name,
      TO_CHAR(o.order_date AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata', 'DD-MM-YYYY') AS order_date,
      o.rate_per_kg,
      o.plate_type,
      o.status,
      o.advance_received,
      i.product_size
    FROM customers c
    LEFT JOIN orders o   ON c.customer_id = o.customer_id
    LEFT JOIN order_items i ON o.id = i.order_id
    WHERE
      c.name ILIKE $1
       OR TO_CHAR(o.order_date AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata', 'DD-MM-YYYY') ILIKE $1
    `,
    [`%${searchTerm}%`]
  );
  return rows;
};