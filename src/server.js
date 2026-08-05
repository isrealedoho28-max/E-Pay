import express from 'express';
import cors from 'cors'
import dotenv from 'dotenv';
dotenv.config();
import job from './lib/cron.js';
import {connectDB} from './lib/db.js';
import authRoutes from "./routes/authRoutes.js";
import activityRoutes from "./routes/activityRoutes.js"
import test from "./routes/test.js"

const app = express();
const port = process.env.PORT || 3000; 

job.start(); // Start the cron job
app.use(express.json());
app.use(cors())

app.use('/api/auth', authRoutes); 
app.use('/api/activities', activityRoutes);
app.use('/api/test', test);



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  connectDB(); 
});