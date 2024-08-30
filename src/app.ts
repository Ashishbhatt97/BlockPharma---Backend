import express, { Request, Response } from "express";
import cors from "cors";

//initiate the server
const app = express();
require("dotenv").config();

const PORT = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

// Routes
app.get("/api/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to the BlockPharma Backend" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
