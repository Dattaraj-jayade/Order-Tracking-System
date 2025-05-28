import './App.css'
import ADDorder from './components/ADDordes'
import Navbar from './components/NavBar'
import TableList from './components/TableList'
import ModalForm from './components/ModelForm';
import { useState, useEffect,useCallback  } from 'react';
import axios from 'axios';




function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
   const [searchTerm, setSearchTerm] = useState('');
  const [clientData, setClientData] = useState(null);
  const [tableData, setTableData] = useState([]);
const [customers, setCustomers] = useState([]); 
  



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

   const handleOpen = (mode, client = null) => {
    setClientData(client);
    setModalMode(mode);
    setIsOpen(true);
  };

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setClientData(null);
  }, []);

  const handleSubmit = async (newClientData) => {
      if (modalMode === 'add') {
   try {
    const response = await axios.post(
      `https://order-tracking-system-cbml.onrender.com/api/Ordes/${newClientData.customer_id}`,
      newClientData
    );
    console.log('Order added:', response.data);
    setTableData((prevData) => [...prevData, response.data]);
  } catch (error) {
    console.error('Error adding order:', error);
  }
  } else {
       const idToUpdate = clientData.customer_id;                       
      console.log('Updating client with ID:', idToUpdate); // Log the ID being updated
      try {
        const response = await axios.put(`https://order-tracking-system-cbml.onrender.com/api/clients/${idToUpdate}`, newClientData);
        console.log('Client updated:', response.data);
        setTableData((prevData) =>
          prevData.map((client) => (client.customer_id === idToUpdate ? response.data : client))
        );
      } catch (error) {
        console.error('Error updating client:', error);
      }

    }// Handle edit item
  }
 


  return (
    <div className="py-5 px-5">
      <Navbar onOpen={() => handleOpen('add')} onSearch={setSearchTerm} />
      <TableList
        tableData={tableData}
        handleOpen={(mode, client) => handleOpen('edit', client)}
        searchTerm={searchTerm}
      />

      {isOpen && (
  <ModalForm
    isOpen={isOpen}
    onClose={handleClose}
    mode={modalMode}
    onSubmit={handleSubmit}
    clientData={clientData}
    clients={customers}
  />
)}
    </div>
  );
}


export default App;



