import express, { Application } from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";




import {
  userRoutes,
  vendorRoutes,
  pharmacistRoutes,
  orderRoutes,
} from "./routes/routes";
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

app.use(morgan("dev"));

// Enable CORS
app.use(cors());

app.use("/api/get" , (req, res) => {
  res.json({ message: "GET request received" });
});

// Static file serving (e.g., profile pictures)
app.use("/api/uploads", express.static(path.join(process.cwd(), "uploads")));

// Routes
app.use("/api/user", userRoutes);
app.use("/api/vendor", vendorRoutes);
app.use("/api/pharmacist", pharmacistRoutes);
app.use("/api/orders", orderRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
