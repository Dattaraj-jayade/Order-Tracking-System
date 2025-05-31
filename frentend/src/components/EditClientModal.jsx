
import { useState, useEffect } from "react";


// ModalForm.js
export default function ModalForm({ isOpen, onClose, onSubmit, clientData, clients }) {
    const [customerId, setCustomerId] = useState('');
    const [name, setName] = useState('');
    const [order_date, setdate] = useState('');
    const [rate_per_kg, setperkg] = useState('');
    const [plate_charges, setpcharges] = useState('');
    const [product_size, setSize] = useState('');
    const [quantityKg, setQuantityKg] = useState('');
    const [plate_type, settype] = useState('');
    const [status, setStatus] = useState(false);
    const [advance_received, setadvanc] = useState('');
    const [total_amount_receivable, setRate] = useState('');

    const handleStatusChange = (e) => {
        setStatus(e.target.value === 'true'); // Set status as boolean
    }

    const validateFields = () => {
        return (
            name.trim() &&
            order_date &&
            rate_per_kg &&
            plate_charges !== "" &&
            plate_type.trim() &&
            advance_received !== "" &&
            product_size !== "" &&
            quantityKg !== ""
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateFields()) {
            alert("first add order or order items before updateing.");
            return;
        }

        try {
            const updatedClientData = {

                customerId,
                name,
                order_date,
                rate_per_kg,
                plate_charges,
                plate_type,
                status: status,
                advance_received: Number(advance_received),
                total_amount_receivable: Number(total_amount_receivable),
                product_size: product_size ? Number(product_size) : null,
                quantity_kg: Number(quantityKg || 1)

            }
            await onSubmit(updatedClientData)
            onClose();
        } catch (err) {
            console.error("Error adding client", err);
        }

    }
    useEffect(() => {
        if (clientData) {
            setCustomerId(clientData.customer_id);
            setName(clientData.name ?? '');
            setdate(clientData.order_date?.split('T')[0] || '');
            setperkg(clientData.rate_per_kg);
            setpcharges(clientData.plate_charges);
            setSize(clientData.product_size);
            setQuantityKg(clientData.quantity_kg ?? '');
            settype(clientData.plate_type);
            setStatus(clientData.status);
            setadvanc(clientData.advance_received);
            setRate(clientData.total_amount_receivable);
        }
    }, [clientData]);






    return (
        <>

            <dialog id="my_modal_3" className="modal bg-black/40" open={isOpen}>
                <div className="modal-box">
                    {/* if there is a button in form, it will close the modal */}
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={onClose}>✕</button>
                    <h3 className="font-bold text-lg py-4">Edit Client</h3>

                    <form method="dialog" onSubmit={handleSubmit}>

                        <label className="input input-bordered flex items-center my-4 gap-2">
                            Customer
                            <input type="text" className="grow" value={name} onChange={(e) => setName(e.target.value)} />
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
                            product Size
                            <input type="number" className="grow" value={product_size ?? ""} onChange={(e) => setSize(e.target.value)} />
                        </label>
                        <label className="input input-bordered flex items-center my-4 gap-2">
                            Quantity (kg)
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


                        <button type="submit" className=" btn btn-success">Save Changes </button>
                    </form>

                </div>
            </dialog>

        </>

    );
}
