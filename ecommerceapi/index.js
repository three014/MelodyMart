const express = require("express");
const app = express();
const mongoose = require("mongoose");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const stripeRoute = require("./routes/stripe");
const discountRoute = require("./routes/discount");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

mongoose
    .connect(process.env.MONGO_URL, {
        dbName: "test",
    })
    .then(() => console.log("DB Connection Successful!"))
    .catch((err) => {
        console.log(err);
    });

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);
app.use("/api/checkout", stripeRoute);
app.use("/api/discounts", discountRoute);

app.listen(process.env.PORT || 5000, () => {
    console.log("Backend server is running!");
});