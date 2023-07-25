const mongoose = require("mongoose");

//Defines the cart schema
const CartSchema = new mongoose.Schema(
    {
        userID: { type: String, required:true },
        products: [
            {
                productID: {
                    type: String,
                },
                quantity: {
                    type: Number,
                    default: 1,
                },
            },
        ],
        amount: { type: Number, required: true },
        address: { type: Object, required: true },
        status: { type: String, default: "pending" },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Cart", CartSchema)