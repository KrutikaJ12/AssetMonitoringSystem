// const cron = require("node-cron");
// const { getLiveData } = require("../services/vehicleService");

// function startVehicleScheduler() {
//   console.log("Vehicle scheduler started...");

//   // Run immediately
//   runJob();

//   // Then every minute
//   cron.schedule("* * * * *", runJob);

//   async function runJob() {
//     try {
//       console.log(`[${new Date().toLocaleString()}] Fetching vehicle data...`);

//       await getLiveData();

//       console.log("Vehicle data saved.");
//     } catch (error) {
//       console.error("Scheduler Error:", error.message);
//     }
//   }
// }

// module.exports = startVehicleScheduler;


const { getLiveData } = require("../services/vehicleService");

function startVehicleScheduler() {
  console.log("Vehicle scheduler started...");

  async function runJob() {
    try {
      console.log(`[${new Date().toLocaleString()}] Fetching vehicle data...`);

      await getLiveData();

      console.log("Vehicle data saved.");
    } catch (error) {
      console.error("Scheduler Error:", error.message);
    }
  }

  // First call after 5 seconds
  setTimeout(() => {
    runJob();

    // Then every 65 seconds
    setInterval(runJob, 70000);
  }, 5000);
}

module.exports = startVehicleScheduler;