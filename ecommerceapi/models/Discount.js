const mongoose = require("mongoose");

const DiscountSchema = new mongoose.Schema(
    {
        code: { type: String, required:true, unique:true },
        value: { type: Number, required:true },
        condition: { type: Number },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Discount", DiscountSchema)