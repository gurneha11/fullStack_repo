import express from 'express';
import cors from 'cors';
import { logger } from './middleware/logger.js';
import { errorHandler } from './middleware/errorMiddleware.js';
import uploadRoutes from './routes/uploadRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use(logger);

app.use('/upload', uploadRoutes);

app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

export default app;