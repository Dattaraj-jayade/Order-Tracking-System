import axios from 'axios';
import { format, parseISO, isValid } from 'date-fns';
import { useEffect } from 'react';
import { useState, } from 'react';
export default function TableList({ handleOpen, tableData, setTableData, searchTerm, customers }) {


    const [error, setError] = useState(null);

   

    const filteredData = tableData.filter(client => {
        const nameMatch = client.name?.toLowerCase().includes(searchTerm?.toLowerCase() || '');
        const dateMatch = client.order_date
            ? format(parseISO(client.order_date), 'yyyy-MM-dd').includes(searchTerm)
            : false;

        return nameMatch || dateMatch;
    });


    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this client?");
        if (confirmDelete) {
            try {
                await axios.delete(`https://order-tracking-system-cbml.onrender.com/api/clients/${id}`); // API call to delete client
                setTableData((prevData) => prevData.filter(client => client.customer_id !== id)); // Update state
            } catch (err) {
                setError(err.message); // Handle any errors
            }
        }
    }





    return (
        <>

            {/* {error && <div className="alert alert-error">{error}</div>} */}

            <div className="overflow-x-auto mt-10">
                <table className="table">
                    {/* head */}
                    <thead>
                        <tr>
                            <th></th>
                            <th>Custemer</th>
                            <th>Order Date</th>
                            <th>rate per kg</th>
                            
                            <th>Prouct Sizes</th>
                            <th>Quantity (kg)</th>
                            <th>plate charges</th>
                            <th>plate Type</th>
                            <th>Status</th>
                            <th>Advance</th>
                            <th>Total recivable</th>


                        </tr>
                    </thead>
                    <tbody className="hover">
                        {/* row 1 */}

                        {filteredData.map((client, index) => (
                            <tr key={index}>
                                <th>{index + 1}</th>
                                <td>{client.name}</td>
                                <td>
                                    {client.order_date && isValid(new Date(client.order_date))
                                        ? format(new Date(client.order_date), 'dd-MM-yyyy')
                                        : 'N/A'}
                                </td>
                                <td> ₹ {client.rate_per_kg}</td>
                                
                                <td>{client.product_size} unites</td>
                                <td> kg {client.quantity_kg}</td>
                                <td>  {client.plate_charges}</td>
                                <td>{client.plate_type}</td>
                                <td>
                                    <button className={`btn rounded-full w-20 ${client.status ? `btn-primary` : `btn-outline btn-primary`}`}>
                                        {client.status ? 'PAID' : 'PENDING'}
                                    </button>
                                </td>
                                <td>{client.advance_received}</td>
                                <td>{client.total_amount_receivable}</td>
                                <td>
                                    <button className="btn btn-secondary " onClick={() => handleOpen(client)}>Update</button>
                                </td>
                                <td>
                                    <button className="btn btn-accent" onClick={() => handleDelete(client.customer_id)}>Delete</button>
                                </td>



                            </tr>

                        ))}


                    </tbody>
                </table>
            </div>
        </>
    )
}