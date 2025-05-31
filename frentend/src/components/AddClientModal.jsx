import { useEffect, useState } from "react";


// ModalForm.js
export default function AddClientModal({ isOpen, onClose,  onSubmit }) {

    const [name, setName] = useState(''); // State for Name






    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const clientData = { name }
            await onSubmit(clientData)
            onClose();
        } catch (err) {
            console.error("Error adding client", err);
        }

    }

 
    return (
        <>

            <dialog id="my_modal_3" className="modal bg-black/40" open={isOpen}>
                <div className="modal-box">
                    {/* if there is a button in form, it will close the modal */}
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={onClose}>✕</button>
                    <h3 className="font-bold text-lg py-4">Client Details</h3>

                    <form method="dialog" onSubmit={handleSubmit}>

                        <label className="input input-bordered flex items-center my-4 gap-2">
                            Name
                            <input type="text" className="grow" value={name} onChange={(e) => setName(e.target.value)} />
                        </label>



                        <button type="submit" className=" btn btn-success"> Add Client </button>
                    </form>

                </div>
            </dialog>

        </>

    );
}
