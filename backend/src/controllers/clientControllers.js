import * as clientService from "../services/clientServices.js";
export const getClients = async (req, res) => {
    try {
        const clients = await clientService.getClients();
        res.status(200).json(clients);
    } catch (err) { 
        console.error('Error fetching clients:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
export const createClient = async (req, res) => {
    try {
        const clientData =req.body;
        const NewClient = await clientService.createClient(clientData);
        res.status(200).json(NewClient);
    } catch (err) { 
        console.error('Error creating clients:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


export const updateClient = async (req, res) => {
    try {
         const clientId = req.params.id;
        const clientData = req.body;
        const updatedClient = await clientService.updateClient(clientId, clientData);
        if (!updatedClient) {
            return res.status(404).json({ message: 'Client not found' });
        }
        res.status(200).json(updatedClient);

    } catch (err) { 
        console.error('Error updateing clients:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


export const deleteClient = async (req, res) => {
    try {
         const clientId = req.params.id;
        const deleted = await clientService.deleteClient(clientId);
        if (!deleted) {
        return res.status(404).json({ message: 'Client not found' });
        }
         res.status(200).send();

    } catch (err) { 
        console.error('Error deliting clients:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
export const getById = async (req, res) => {
  try {
    const id = req.params.id;
    const client = await clientService.getById(id);
    if (!client) return res.status(404).json({ message: 'Client not found' });

    res.status(200).json(client);
  } catch (err) {
    console.error('Error fetching client:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const searchClients = async (req, res) => {
    try {
      const searchTerm = req.query.q; // Get the search term from the query parameters
      const clients = await clientService.searchClients(searchTerm);
      res.status(200).json(clients);
    } catch (error) {
      console.error('Error searching clients:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };