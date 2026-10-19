import { io, Socket } from "socket.io-client";

// Apne backend ka URL yahan dein (agar .env use kar rahe hain toh Vite ke tareeqe se)
const SOCKET_URL = "http://localhost:5000"; 

export const socket: Socket = io(SOCKET_URL, {
  autoConnect: true,
});