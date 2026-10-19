const { getIO } = require("../sockets/socketServer");

function broadcastAssetUpdate(updatedAsset) {
  try {
    const io = getIO();
    // Sirf us updated asset ka data React frontend ko emit karo
    io.emit("assetUpdate", updatedAsset);
  } catch (error) {
    console.error("Error broadcasting socket update:", error.message);
  }
}

module.exports = { broadcastAssetUpdate };