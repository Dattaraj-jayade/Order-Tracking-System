import { query } from "../db.js"

export const getOrders = async() => {
    const {rows} = await query('SELECT * FROM orders');
    return rows;
}
export const createOrder = async (orderData) => {
    const { customer_id,order_date,rate_per_kg,advance_received,plate_type,plate_charges,status } = orderData;
    const { rows } = await query(`
        INSERT INTO orders(customer_id,order_date,rate_per_kg,advance_received,plate_type,plate_charges,status )
        VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING*`,
        [customer_id,order_date,rate_per_kg,advance_received,plate_type,plate_charges,status]
    );
    return rows[0];
}

// export const createOrder = async (orderData) => {
//   const {
//     customer_id,
//     order_date,
//     rate_per_kg,
//     advance_received,
//     plate_type,
//     plate_charges,
//     status,
//     order_items = []
//   } = orderData

  
//   try {
//     await query("BEGIN")

//     // 1) Insert into orders
//     const orderRes = await query(
//       `INSERT INTO orders
//          (customer_id, order_date, rate_per_kg, advance_received, plate_type, plate_charges, status)
//        VALUES ($1,$2,$3,$4,$5,$6,$7)
//        RETURNING *`,
//       [
//         customer_id,
//         order_date,
//         rate_per_kg,
//         advance_received,
//         plate_type,
//         plate_charges,
//         status
//       ]
//     )
//     const order = orderRes.rows[0]

//     // 2) Insert order_items
//     if (order_items.length) {
//       const values = []
//       const placeholders = order_items
//         .map(({ product_size, quantity_kg }, i) => {
//           const idx = i * 3
//           values.push(order.id, product_size, quantity_kg)
//           return `($${idx + 1}, $${idx + 2}, $${idx + 3})`
//         })
//         .join(", ")

//       const itemsRes = await query(
//         `INSERT INTO order_items (order_id, product_size, quantity_kg)
//          VALUES ${placeholders}
//          RETURNING *`,
//         values
//       )
//       order.items = itemsRes.rows
//     } else {
//       order.items = []
//     }

//     await query("COMMIT")
//     return order

//   } catch (err) {
//     await query("ROLLBACK")
//     throw err
//   }
// }

export const updateOrder = async (orderId,orderData) => {
    const { customer_id,order_date,rate_per_kg,advance_received,plate_type,plate_charges,status } = orderData;
    const { rows } = await query(`
        UPDATE orders SET customer_id= $1,order_date = $2,rate_per_kg = $3,advance_received =$4,plate_type =$5,plate_charges=$6,status=$7 
        WHERE id = $8 RETURNING*`,
        [customer_id,order_date,rate_per_kg,advance_received,plate_type,plate_charges,status,orderId]
    );
    return rows[0];
}

export const deleteOrder = async (orderId) => {
  try {
    await query('BEGIN');

    // Delete related order_items first
    await query(`DELETE FROM order_items WHERE order_id = $1`, [orderId]);

    // Then delete the order itself
    const { rowCount } = await query(`DELETE FROM orders WHERE id = $1`, [orderId]);

    await query('COMMIT');
    return rowCount > 0;
  } catch (error) {
    await query('ROLLBACK');
    console.error('Error deleting order:', error);
    return false;
  }
};
export const getById = async (id) => {
  const orderRes = await query(`SELECT * FROM orders WHERE id = $1`, [id]);
  const order = orderRes.rows[0];
  if (!order) return null;

  const itemsRes = await query(`SELECT * FROM order_items WHERE order_id = $1`, [id]);
  const items = itemsRes.rows;

  
const totalQty = items.reduce((sum, i) => sum + Number(i.quantity_kg ?? 0), 0);
  const rate = Number(order.rate_per_kg ?? 0);
  const plate = Number(order.plate_charges ?? 0);
  const advance = Number(order.advance_received ?? 0);

  const total = (rate * totalQty) + plate - advance;
  return { ...order, items, total_amount_receivable: total };
};