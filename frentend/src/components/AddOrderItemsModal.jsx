import { useState } from "react";

export default function AddOrderItemsModal({ isOpen, onClose, onSubmit, clients = [] }) {
  const [product_size, setSize] = useState('');
  const [selectedClient, setSelectedClient] = useState('');
  const [quantity_kg, setQuantityKg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedClient) return alert("Please select a client/order.");

    try {
      const itemData = {
        order_id: selectedClient,      // matches your URL param
        product_size: Number(product_size),  // always a string
        quantity_kg: Number(quantity_kg),  // convert to number
      };
      await onSubmit(itemData);
      onClose();
      setSize('');
      setQuantityKg('');
    } catch (err) {
      console.error("Error adding order item", err);
    }
  };

  return (
    <dialog className="modal bg-black/40" open={isOpen}>
      <div className="modal-box">
        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={onClose}>✕</button>
        <h3 className="font-bold text-lg py-4">Add Order Item</h3>

        <form method="dialog" onSubmit={handleSubmit}>
          {/* If you are mapping clients somewhere, safeguard it */}
          {/* Example dropdown for selecting client */}
          <select
            className="select select-bordered w-full mb-4"
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
            required
          >
            <option value="" disabled>Select Client</option>
            {clients.map((client) => (
              <option key={client.customer_id} value={client.customer_id}>
                {client.name}
              </option>
            ))}
          </select>
          <label className="input input-bordered flex items-center my-4 gap-2">
            Product Size
            <input
              type="text"
              className="grow"
              value={product_size}
              onChange={(e) => setSize(e.target.value)}
              required
            />
          </label>

          <label className="input input-bordered flex items-center my-4 gap-2">
            Quantity (kg)
            <input
              type="number"
              className="grow"
              value={quantity_kg}
              onChange={(e) => setQuantityKg(e.target.value)}
              required
            />
          </label>



          <button type="submit" className="btn btn-success">Add Item</button>
        </form>
      </div>
    </dialog>
  );
}
