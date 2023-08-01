const express = require("express");
const app = express();
const mongoose = require("mongoose");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const discountRoute = require("./routes/discount");
const cors = require("cors");

//Sets up a Node.js server using the Express framework to handle API requests and connects it to a MongoDB database using Mongoose

const MONGO_URL = "mongodb+srv://siaxvii:siaxvii1@clustergroup1.pbqzzro.mongodb.net/";

//Configures MongoDB connection
mongoose.connect(MONGO_URL, { dbName: "test" })
    .then(() => console.log("DB Connection Successful!"))
    .catch((err) => {
        console.log(err);
    });

//Defines API routes to handle specific API endpoints
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);
app.use("/api/discounts", discountRoute);

//Starts the server
app.listen(process.env.PORT || 5000, () => {
    console.log("Backend server is running!");
});