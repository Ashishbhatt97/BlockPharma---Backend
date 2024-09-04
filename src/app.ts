import express, { Application } from "express";
import cors from "cors";
import { userRoutes, vendorRoutes } from "./routes/routes";
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

// Static file serving (e.g., profile pictures)
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/user", userRoutes);
app.use("/api/vendor", vendorRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
