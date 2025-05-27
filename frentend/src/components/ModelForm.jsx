
import { useState, useEffect } from "react";


// ModalForm.js
export default function ModalForm({ isOpen, onClose, mode, onSubmit, clientData,clients }) {
const [selectedCustomerId, setSelectedCustomerId] = useState('');
    const [name, setName] = useState('');
    const [order_date, setdate] = useState('');
    const [rate_per_kg, setperkg] = useState('');
    const [product_size, setSize] = useState('');
    const [quantityKg, setQuantityKg] = useState('');
    const [plate_type, settype] = useState('');
    const [status, setStatus] = useState(false);
    const [advance_received, setadvanc] = useState('');
    const [total_amount_receivable, setRate] = useState('');

    const handleStatusChange = (e) => {
        setStatus(e.target.value === 'true'); // Set status as boolean
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const clientData = {
                customer_id: selectedCustomerId,
                name,
                order_date,
                rate_per_kg,
                product_size: Number(product_size),
                plate_type,
                status: status,
                advance_received: Number(advance_received),
                total_amount_receivable: Number(total_amount_receivable),
                order_items: [                                          // 🔧 ADDED
                    {
                        product_size,
                        quantity_kg: Number(quantityKg || 1)
                    }
                ]
            }
            await onSubmit(clientData)
            onClose();
        } catch (err) {
            console.error("Error adding client", err);
        }

    }
    useEffect(() => {
        if (mode === 'edit' && clientData) {
            setName(clientData.name?? '');
            setdate(clientData.order_date?.split('T')[0] || '');
            setperkg(clientData.rate_per_kg);
            setSize(clientData.product_size);
            setQuantityKg(clientData.quantity_kg ?? '');
            settype(clientData.plate_type);
            setStatus(clientData.status);
            setadvanc(clientData.advance_received);
            setRate(clientData.total_amount_receivable);
        } else {
            // ALWAYS pass a value — never call setX() with no args
            setName('');
            setdate('');
            setperkg('');
            setSize('');
            setQuantityKg('');
            settype('');
            setStatus(false);
            setadvanc('');
            setRate('');
            setSelectedCustomerId('');
        }
    }, [mode, clientData]);






    return (
        <>

            <dialog id="my_modal_3" className="modal bg-black/40" open={isOpen}>
                <div className="modal-box">
                    {/* if there is a button in form, it will close the modal */}
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={onClose}>✕</button>
                    <h3 className="font-bold text-lg py-4">{mode === 'edit' ? 'Edit Client' : 'Client Details'}</h3>

                    <form method="dialog" onSubmit={handleSubmit}>

                        <label className="input input-bordered flex items-center my-4 gap-2">
                            Customer
                            <select
                                className="grow"
                                value={name}
                                onChange={(e) => {
                                    const selectedName = e.target.value;
                                    setName(selectedName);
                                    const matchedClient = clients.find(c => c.name === selectedName);
                                    if (matchedClient) {
                                        setSelectedCustomerId(matchedClient.customer_id);
                                    }
                                }}
                                required
                            >
                                <option value="">Select a customer</option>
                                {clients.map((client) => (
                                    <option key={client.customer_id} value={client.name}>
                                        {client.name}
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
                            product Size
                            <input type="number" className="grow" value={product_size} onChange={(e) => setSize(e.target.value)} />
                        </label>
                        <label className="input input-bordered flex items-center my-4 gap-2">
                            Quantity (kg)                                         {/* 🔧 NEW FIELD */}
                            <input
                                type="number"
                                className="grow"
                                value={quantityKg}
                                onChange={(e) => setQuantityKg(e.target.value)}
                            />
                        </label>
                        <label className="input input-bordered flex items-center my-4 gap-2">
                            plate Type
                            <input type="text" className="grow" value={plate_type} onChange={(e) => settype(e.target.value)} />
                        </label>

                        {/* ++ made this anumber */}
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


                        <button type="submit" className=" btn btn-success">{mode === 'edit' ? 'Save Changes' : 'Add orders'}</button>
                    </form>

                </div>
            </dialog>

        </>

    );
}
