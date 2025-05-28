import express from 'express';
import cors from 'cors'
import clientRoutes from './routes/clientRoute.js'
import orderRoutes from './routes/orderRoute.js'
import order_itemsRoutes from './routes/order_itemRoute.js'

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api', clientRoutes);
app.use('/api', orderRoutes);
app.use('/api',order_itemsRoutes);
app.listen(port, () => {
    console.log("listening on port 3000")
});
