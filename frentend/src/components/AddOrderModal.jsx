import React, { useState, useEffect } from 'react';

export default function AddOrderModal({ isOpen, onClose, onSubmit, clients }) {
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
 
  const [order_date, setdate] = useState('');
  const [rate_per_kg, setperkg] = useState('');
  const [plate_charges, setpcharges] = useState('');
  const [plate_type, settype] = useState('');
  const [status, setStatus] = useState(false);
  const [advance_received, setadvanc] = useState('');
  const [total_amount_receivable, setRate] = useState('');

  const handleStatusChange = (e) => {
        setStatus(e.target.value === 'true'); // Set status as boolean
    }

  useEffect(() => {
    if (isOpen) {
      
      setSelectedCustomerId('');
      setdate('');
      setperkg('');
      setpcharges('');
      settype('');
      setStatus(false);
      setadvanc('');
      setRate('');
    }
  }, [isOpen]);

  const handleSubmit = async e => {
    e.preventDefault();

    const payload = {
      customer_id: selectedCustomerId,
       order_date,
      rate_per_kg,
       plate_charges: Number(plate_charges),
       plate_type,
      status: status,
      advance_received: Number(advance_received),
      total_amount_receivable: Number(total_amount_receivable),
    };

    await onSubmit(payload);
    onClose();
  };

  if (!isOpen) return null;
  return (
    <dialog open className="modal  bg-black/40">
      <div className="modal-box">
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={onClose}
        >
          ✕
        </button>
        <h3 className="font-bold text-lg mb-4">Add Order</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Customer selector */}
          <label className="input input-bordered flex items-center my-4 gap-2">
            Customer
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              required
              className="select select-bordered w-full"
            >
              <option >Select a customer</option>
              {clients.map(c => (
                <option key={c.customer_id} value={c.customer_id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>

          <label className="input input-bordered flex items-center my-4 gap-2">
            Order data
            <input type="date" className="grow" value={order_date} onChange={(e) => setdate(e.target.value)} />
          </label>

          <label className="input input-bordered flex items-center my-4 gap-2">
            rate_per_kg
            <input type="number" className="grow" value={rate_per_kg} onChange={(e) => setperkg(e.target.value)} />
          </label>

          <label className="input input-bordered flex items-center my-4 gap-2">
            plate_charges
            <input type="number" className="grow" value={plate_charges} onChange={(e) => setpcharges(e.target.value)} />
          </label>

          <label className="input input-bordered flex items-center my-4 gap-2">
            plate Type
            <input type="text" className="grow" value={plate_type} onChange={(e) => settype(e.target.value)} />
          </label>

          <div className="flex mb-4 justify-between">


            <select
              value={status ? 'true' : 'false'}
              className="select select-bordered w-full max-w-xs"
              onChange={handleStatusChange}
            >
              <option value="false">PENDING</option>
              <option value="true">PAID</option>
            </select>

            <label className="input input-bordered flex mr-4 items-center gap-2">
              Advance
              <input type="number" className="grow" value={advance_received} onChange={(e) => setadvanc(e.target.value)} />
            </label>

          </div>

          <label className="input input-bordered flex mr-5 items-center gap-2">
            Total recevable
            <input type="number" className="grow" value={total_amount_receivable} onChange={(e) => setRate(e.target.value)} />
          </label>

          <button type="submit" className="btn btn-success w-full">
            Add Order
          </button>
        </form>
      </div>
    </dialog>
  );
}
