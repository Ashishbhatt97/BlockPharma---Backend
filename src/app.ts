import express, { Application } from "express";
import cors from "cors";
import { userRoutes } from "./routes/routes";
import bodyParser from "body-parser";
require("dotenv").config();

//initiate the server
const app: Application = express();

const PORT = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

// Enable CORS
app.use(cors());

// Routes
app.use("/api/user", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
