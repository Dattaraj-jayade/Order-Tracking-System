import './App.css'
import AddOrderModal from './components/AddOrderModal';
import Navbar from './components/NavBar'
import TableList from './components/TableList'
import EditClientModal from './components/EditClientModal';
import ADDorderitems from './components/AddOrderItemsModal';
import ADDClient from './components/AddClientModal';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';




function App() {
  const [isAddClientOpen, setIsAddClientOpen] = useState(false)
  const [isAddOrderOpen, setIsAddOrderOpen] = useState(false)
  const [isAddOrderitemOpen, setIsAddOrderitemOpen] = useState(false)
  const [isEditClientOpen, setIsEditClientOpen] = useState(false)

  const [searchTerm, setSearchTerm] = useState('');
  const [clientData, setClientData] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState(null);



  useEffect(() => {
    const fetchClientsWithTotals = async () => {
      try {
        const clientsRes = await axios.get("https://order-tracking-system-cbml.onrender.com/api/clients/");
        const clients = clientsRes.data;

        // For each client, fetch their total_amount_receivable
        const clientsWithTotals = await Promise.all(
          clients.map(async (client) => {
            
              const totalRes = await axios.get(`https://order-tracking-system-cbml.onrender.com/api/clients/${client.customer_id}`);
              return {
                ...client,
                total_amount_receivable: totalRes.data.total_amount_receivable

              };
             
          })
        );

        setTableData(clientsWithTotals);
        setCustomers(clients);

      } catch (err) {
        setError(err.message);
      }
    };

    fetchClientsWithTotals();
  }, []);

  // Open and close handlers for Add Order Modal
  const openAddOrderModal = () => setIsAddOrderOpen(true)
  const closeAddOrderModal = () => setIsAddOrderOpen(false)
  const openAddClient = () => setIsAddClientOpen(true)
  const closeAddClient = () => setIsAddClientOpen(false)
  const openAddOrderitem = () => setIsAddOrderitemOpen(true)
  const closeAddOrderitem = () => setIsAddOrderitemOpen(false)

  // Open and close handlers for Edit Client Modal
  const openEditClientModal = (client) => {
    setClientData(client)
    setIsEditClientOpen(true)
  }
  const closeEditClientModal = () => {
    setClientData(null)
    setIsEditClientOpen(false)
  }

  const handleAddClient = async newClient => {
    try {
      const { data } = await axios.post('https://order-tracking-system-cbml.onrender.com/api/clients/', newClient);
      setTableData(prev => [...prev, data]);
      closeAddClient();
      window.location.reload();
    } catch (err) {
      console.error('Error adding client:', err);
    }
  };

  const handleAddOrder = async (orderData) => {
    try {
      const response = await axios.post(
        `https://order-tracking-system-cbml.onrender.com/api/Ordes/${orderData.customer_id}`,
        orderData
      );
      console.log('Order added:', response.data);
      setTableData(prev => [...prev, response.data]);
      closeAddOrderModal();
      window.location.reload();
    } catch (error) {
      console.error('Failed to add order:', error);
    }
  };

  const handleAddOrderItem = async (itemData) => {
  try {
    // itemData = { order_id, product_size, quantity_kg }
    const response = await axios.post(
      `https://order-tracking-system-cbml.onrender.com/api/order_items/${itemData.order_id}`,
      itemData
    );
   window.location.reload();
    // update your UI...
  } catch (error) {
    console.error("Error adding order item:", error);
  }
};

  const handleEditClient = async (updatedClientData) => {
    const idToUpdate = updatedClientData.customerId;
    try {
      const response = await axios.put(
        `https://order-tracking-system-cbml.onrender.com/api/clients/${idToUpdate}`,
        updatedClientData
      );
      
      setTableData((prevData) =>
        prevData.map((client) =>
          client.customer_id === idToUpdate ? response.data : client
        )
      );
      window.location.reload();
    } catch (error) {
      console.error('Error updating client:', error);
    }
  };


  return (
    <div className="py-5 px-5">
      <Navbar onAddClient={openAddClient}
        onAddOrder={openAddOrderModal}
        onAddOrderItem={openAddOrderitem} onSearch={setSearchTerm} />
      <TableList
        customers={customers}
        tableData={tableData}
        setTableData={setTableData}
        handleOpen={openEditClientModal}
        searchTerm={searchTerm}
      />

      <ADDorderitems
        ADDClient isOpen={isAddOrderitemOpen}
        onClose={closeAddOrderitem}
        onSubmit={handleAddOrderItem}
        
        clients={customers}
      />
      <ADDClient isOpen={isAddClientOpen}
        onClose={closeAddClient}
        onSubmit={handleAddClient}
        clients={customers} />

      <AddOrderModal
        isOpen={isAddOrderOpen}
        onClose={closeAddOrderModal}
        onSubmit={handleAddOrder}
        clients={customers}
      />
      <EditClientModal
        isOpen={isEditClientOpen}
        onClose={closeEditClientModal}
        onSubmit={handleEditClient}
        clientData={clientData}
        clients={customers}

      />

    </div>
  );
}


export default App;



