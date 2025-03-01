const express = require("express");
const app = express();
const dbConnect = require("./config/database");

const port = process.env.PORT || 3000;
dbConnect();

app.get("/", (req, res) => {
    res.send("Hello world");
});  

app.listen(port, () => {
    console.log(`app is listening on port ${port}`);
  });