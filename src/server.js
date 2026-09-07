import express from 'express';
import cors from 'cors'
import dotenv from 'dotenv';
dotenv.config();
import job from './lib/cron.js';
import {connectDB} from './lib/db.js';
import authRoutes from "./routes/authRoutes.js";
import activityRoutes from "./routes/activityRoutes.js"
import cardActivity from "./routes/cardActivity.js"
import addBalance from "./routes/addBalance.js"
import test from "./routes/test.js"
import messageRoutes from "./routes/messageRoutes.js"
import makeTransfer from "./routes/makeTransfer.js"
import pin from "./routes/pin.js"
const app = express();
const port = process.env.PORT || 3000; 

job.start(); // Start the cron job
app.use(express.json());
app.use(cors())

app.use('/api/auth', authRoutes); 
app.use('/api/activities', activityRoutes);
app.use('/api/card', cardActivity);
app.use('/api/test', test);
app.use('/api/message', messageRoutes )
app.use('/api/bankpin', pin)
app.use('/api/transfer', makeTransfer)
app.use('/api/addMoney', addBalance)
app.get('/', (req, res)=>{
  res.send("E-Pay backend is Ready")
})


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  connectDB(); 
});