const axios = require("axios");
const { sql } = require("../config/db");
// ✅ Checks if the customer exists.
// ✅ Checks if a token exists.
// ✅ Uses the existing token if it's less than 28 minutes old.
// ✅ Generates a new token if it's missing or expired.
// ✅ Updates the database with the new token and timestamp.
// ✅ Returns only the token string.

const generateAccessToken = async () => {
  try {
    const response = await axios.post(
      `${process.env.IOT_BASE_URL}?token=generateAccessToken`,
      {
        username: process.env.IOT_USERNAME,
        password: process.env.IOT_PASSWORD,
      },
    );

    console.log("Generate Token Response:");
    console.log(JSON.stringify(response.data, null, 2));

    return response.data;
  } catch (error) {
    console.error(
      "Error while generating token:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

const getValidToken = async (customerId) => {
  try {
    // Step 1: Fetch customer token details
    const result = await sql.query`
      SELECT
        UffizioToken,
        UffizioTokenDateTime
      FROM CustomerMaster
      WHERE CustomerID = ${customerId}
    `;

    if (result.recordset.length === 0) {
      throw new Error("Customer not found");
    }

    const customer = result.recordset[0];

    // Step 2: If token exists, check if it's still valid
    if (customer.UffizioToken && customer.UffizioTokenDateTime) {
      const timeResult = await sql.query`
    SELECT GETDATE() AS CurrentTime
`;
      const now = timeResult.recordset[0].CurrentTime;
      const tokenTime = customer.UffizioTokenDateTime;

      const tokenAge = (now.getTime() - tokenTime.getTime()) / 1000 / 60;

      console.log("Current Time:", now);
      console.log("Token Time:", tokenTime);
      console.log("Token Age:", tokenAge);
      if (tokenAge < 28) {
        console.log("Using existing token.");
        return customer.UffizioToken;
      }

      console.log("Token expired. Generating new token...");
    } else {
      console.log("No token found. Generating new token...");
    }

    // Step 3: Generate new token
    const tokenResponse = await generateAccessToken();

    if (!tokenResponse || !tokenResponse.data || !tokenResponse.data.token) {
      throw new Error("Failed to generate token.");
    }

    const newToken = tokenResponse.data.token;

    // Step 4: Update token in database
    await sql.query`
      UPDATE CustomerMaster
      SET
        UffizioToken = ${newToken},
        UffizioTokenDateTime = GETDATE()
      WHERE CustomerID = ${customerId}
    `;

    console.log("Database updated with new token.");

    // Step 5: Return token
    return newToken;
  } catch (error) {
    console.error(
      "Error in getValidToken:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

module.exports = {
  generateAccessToken,
  getValidToken,
};
