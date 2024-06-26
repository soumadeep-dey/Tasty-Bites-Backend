const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const db = require("./db");
// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);
app.use(cookieParser());

const authRoutes = require("./routes/authRoutes");
const featureRoutes = require("./routes/featureRoutes");
app.use("/auth", authRoutes);
app.use("/feature", featureRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🛜  Server running on port: ${PORT}...`);
});
