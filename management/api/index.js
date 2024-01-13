require("dotenv").config();

const supabase = require("./configs/dbConfig");
const express = require("express");
const port = process.env.PORT;
const app = express();

const routers = require("./routers/router");

app.use(express.json());

app.listen(port, () => {
  console.log(`Running on port ${port}`);
  if (supabase !== null) {
    console.log("DB Connected");
  }
});

app.get("/", (req, res) => {
  res.send("Hello, this is Firmansyah's API project");
});

app.use("/", routers);
