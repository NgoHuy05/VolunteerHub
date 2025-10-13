require("dotenv").config();
const cors = require("cors");
const morgan = require("morgan");
const express = require("express");
const connectDatabase = require("./config/database")
const routers = require("./routers/index.route");
const port = process.env.PORT;
const app = express();
connectDatabase();
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use(morgan("dev"));
routers(app);
app.listen(port, () => {
    console.log(`server running on port ${port}`)
})