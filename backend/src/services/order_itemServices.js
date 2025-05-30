import { query } from "../db.js"

export const getOrder_items = async() => {
    const {rows} = await query('SELECT * FROM order_items');
    return rows;
}
export const createOrder_item = async(order_itemData) => {
    const{order_id,product_size,quantity_kg} =order_itemData
    const {rows} = await query(`
        INSERT INTO order_items(order_id,product_size,quantity_kg)
        VALUES($1,$2,$3) RETURNING*`,
    [order_id,product_size,quantity_kg]
    );
    return rows[0];
}
export const updateOrder_items = async(order_itemId,order_itemData) => {
    const{order_id,product_size,quantity_kg,} = order_itemData;
    const {rows} = await query(`
        UPDATE  order_items SET order_id=$1,product_size=$2,quantity_kg=$3
         WHERE id = $4 RETURNING*`,
    [order_id,product_size,quantity_kg,order_itemId]
    );
    return rows[0];
}
export const deleteOrder_items = async (order_itemId) => {
    const { rowCount } = await query(`DELETE FROM order_items WHERE id = $1`, [order_itemId]);
    return rowCount > 0; // Returns true if a row was deleted, false otherwise
};