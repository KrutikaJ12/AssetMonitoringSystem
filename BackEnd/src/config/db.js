const sql = require("mssql");

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  port: parseInt(process.env.DB_PORT),

  options: {
    trustServerCertificate: true,
    encrypt: false,
  },
};

let pool = null;
const connectDB = async () => {
  try {
    pool = await sql.connect(dbConfig);
    console.log("✅ SQL Server Connected");
  } catch (err) {
    console.error("❌ SQL Connection Error:", err);
  }
};


const getPool = () => {
  // console.log("Current Pool :", pool);
   if (!pool) {
      throw new Error("Database not connected.");
   }

   return pool;
};
module.exports = {
  sql,
  connectDB,
  getPool
};