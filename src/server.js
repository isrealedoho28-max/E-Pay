import express from 'express';
import cors from 'cors'
import dotenv from 'dotenv';
dotenv.config();
import {connectDB} from './lib/db.js';
import authRoutes from "./routes/authRoutes.js";
import activityRoutes from "./routes/activityRoutes.js"

const app = express();
const port = process.env.PORT || 3000; 
app.use(express.json());
app.use(cors())

app.use('/api/auth', authRoutes); 
app.use('api/books', activityRoutes);



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  connectDB(); 
});