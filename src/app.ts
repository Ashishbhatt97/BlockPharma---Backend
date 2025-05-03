import express, { Application } from "express";
import cors from "cors";
import morgan from "morgan";

import { userRoutes, vendorRoutes, pharmacistRoutes } from "./routes/routes";
import bodyParser from "body-parser";
import path from "path";
import { getDashboardCounts } from "./controllers/countsController";
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

app.use(morgan("dev"));

// Enable CORS
app.use(cors());

app.get("/", (req, res) => {
  res.send("Server is ok and running");
});

// Static file serving (e.g., profile pictures)
app.use("/api/uploads", express.static(path.join(process.cwd(), "uploads")));

// Routes
app.use("/api/counts", getDashboardCounts);
app.use("/api/user", userRoutes);
app.use("/api/supplier", vendorRoutes);
app.use("/api/pharmacy", pharmacistRoutes);

// app.use("/api/orders", orderRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
