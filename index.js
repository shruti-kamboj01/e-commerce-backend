const express = require("express");
const app = express();
const authRoutes = require('./routes/Auth')
const productRoutes = require('./routes/Product')
const categoryRoutes = require('./routes/Category')
const salesRoutes = require("./routes/Sales")
const orderRoutes = require("./routes/Order");

const dbConnect = require("./config/database");
const port = process.env.PORT || 3000;
dbConnect();

app.use(express.json());

app.use("/api/v1", authRoutes)
app.use('/api/v1',categoryRoutes)
app.use('/api/v1', productRoutes)
app.use("/api/v1", salesRoutes)
app.use("/api/v1", orderRoutes); 

app.get("/", (req, res) => {
    res.send("Hello world");
  });


 
app.listen(port, () => {
    console.log(`app is listening on port ${port}`);
  }); 