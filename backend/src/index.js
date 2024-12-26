import express from 'express';
import dotenv from "dotenv"
import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
import { connectDB } from "./lib/db.js"
import cookieParser from "cookie-parser";
import cors from "cors";
import { server, app } from "./lib/socket.js"
import path from "path";

dotenv.config();
const PORT = process.env.PORT;
const __dirname = path.resolve();


app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    // allowedHeaders: ["Content-Type", "Authorization"]  //Add other headers you want to pass through CORS request
}));
// app.use(cors());


app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);



if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
}


// Socket.IO
server.listen(PORT, () => {
    console.log('server is running on port ' + PORT);
    connectDB();
});







