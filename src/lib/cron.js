import cron from "cron";
import https from "https";
import UserModel from "../models/userModel.js";
import HistoryModel from "../models/historyModel.js";


const job = new cron.CronJob("* * * * *", async function () {

  console.log("cron job is running")

const fiveMinutesAgo = new Date(
  Date.now()- 5*60*100
);

const pendingTransfer= await HistoryModel.find({
  status:"..pending",
  date:{
    $lte: fiveMinutesAgo
  }
});

for(const transfer of pendingTransfer){
  try {
    const userId= transfer.user;

    const updatUser= await UserModel.findByIdAndUpdate(userId, {
      $inc:{
        balance: transfer.amount
      }
    },
  
  {
    new:true
  });

  if(!updatUser){
    console.log(`user not found for transfer ${transfer._id}`);
continue;
  }

  await HistoryModel.findByIdAndUpdate(transfer._id,{
    status:"reversed"
  });

  console.log(`Transfer ${transfer._id} reversed.  money returned to user ${userId}`);


  } catch (error) {
    console.log(`Error reversing transfer ${transfer._id}: ${error.message}`);
  }
}




 // Replace with your desired URL



  https.get(`${process.env.API_URL}/api/test/testing`, (res) => {
    if(res.statusCode=== 200){console.log(`Cron job executed. Status code: ${res.statusCode}`);}
    else{ console.log(`Get request failed. Status code: ${res.statusCode}`);}
  }).on("error", (err) => {
    console.error(`Error executing cron job: ${err.message}`);
  });
});

export default job;
