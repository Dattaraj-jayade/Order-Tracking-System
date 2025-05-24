import './App.css'
import ADDForm from './components/ADDform'
import Navbar from './components/NavBar'
import TableList from './components/TableList'
import ModalForm from './components/ModelForm';
import { useState, useEffect } from 'react';
import axios from 'axios';




function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
   const [searchTerm, setSearchTerm] = useState('');
  const [clientData, setClientData] = useState(null);
  const [tableData, setTableData] = useState([]);

  



  useEffect(() => {
    const fetchClientsWithTotals = async () => {
      try {
        const clientsRes = await axios.get("http://localhost:3000/api/clients/");
        const clients = clientsRes.data;

        // For each client, fetch their total_amount_receivable
        const clientsWithTotals = await Promise.all(
          clients.map(async (client) => {
            const totalRes = await axios.get(`http://localhost:3000/api/clients/${client.customer_id}`);
            return {
              ...client,
              total_amount_receivable: totalRes.data.total_amount_receivable
            };
          })
        );

        setTableData(clientsWithTotals);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchClientsWithTotals();
  }, []);

  const handleOpen = (mode, client) => {
    setClientData(client);
    setModalMode(mode);
    setIsOpen(true);
  };

  const handleSubmit = async (newClientData) => {
    if (modalMode === 'add') {
      try {
        const response = await axios.post('http://localhost:3000/api/clients', newClientData); // Replace with your actual API URL
        console.log('Client added:', response.data); // Log the response
        setTableData((prevData) => [...prevData, response.data]);
        // Optionally, update your state here to reflect the newly added client
      } catch (error) {
        console.error('Error adding client:', error); // Log any errors
      }
      console.log('modal mode Add');

    } else {
       const idToUpdate = clientData.customer_id;                       
      console.log('Updating client with ID:', idToUpdate); // Log the ID being updated
      try {
        const response = await axios.put(`http://localhost:3000/api/clients/${idToUpdate}`, newClientData);
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
  <>
    {/* ++ py-5 px-5 */}
    <div className="py-5 px-5 ">
      <Navbar onOpen={() => handleOpen('add')}  onSearch={setSearchTerm} />
      <TableList setTableData={setTableData} tableData={tableData}
        handleOpen={handleOpen}  searchTerm={searchTerm}/>



      <ModalForm isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        mode={modalMode}
        onSubmit={handleSubmit} clientData={clientData}
      />

    </div>

  </>
)
}

export default App
