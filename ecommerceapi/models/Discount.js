const mongoose = require("mongoose");

//Defines the discount schema
const DiscountSchema = new mongoose.Schema(
    {
        code: { type: String, required:true, unique:true },
        value: { type: Number, required:true },
        condition: { type: Number, default: 0 },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Discount", DiscountSchema)