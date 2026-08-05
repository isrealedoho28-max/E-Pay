import cron from "cron";
import https from "https";

const job = new cron.CronJob("*/14 * * * *", function () {
 // Replace with your desired URL

  https.get(`${process.env.API_URL}/api/test`, (res) => {
    if(res.statusCode=== 200){console.log(`Cron job executed. Status code: ${res.statusCode}`);}
    else{ console.log(`Get request failed. Status code: ${res.statusCode}`);}
  }).on("error", (err) => {
    console.error(`Error executing cron job: ${err.message}`);
  });
});

export default job;
