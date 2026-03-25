import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import errorHandler from "./middleware/errorHandler.js";
import ConnectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";
import flashcardRoutes from "./routes/flashcardRoutes.js";
import aiRoutes from "./routes/aiRoutes.js"
import quizRoutes from "./routes/quizRoutes.js"
import progressRoutes from "./routes/progressRoutes.js"

// ES6 module _dirname workaround
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Initialize Express app
const app = express();

//connect to MongoDB
ConnectDB();

//Middleware
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Static Folder for uplaods
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); 

//Routes    
app.use("/api/auth", authRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/flashcards", flashcardRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/progress", progressRoutes);

app.use(errorHandler); // Custom error handling middleware

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ success: false, error: 'Route not found', statusCode: 404 });
}); 

//Start Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

process.on("unhandledRejection", (err) => {
    console.error(`Error: ${err.message}`);
    process.exit(1);
});
