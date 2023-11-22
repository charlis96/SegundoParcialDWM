import express from 'express';
import 'dotenv/config';
import authRoutes from './routes/authRoutes.js';
import verificarToken from './middlewares/authMiddleware.js';
import jugadoresRoutes from './routes/jugadoresRoutes.js';
import errorHandler from './middlewares/errorMiddleware.js';

const app = express();
app.use(express.json());

app.use('', authRoutes);

app.use(verificarToken);

app.use('/players', jugadoresRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
