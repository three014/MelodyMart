const mongoose = require("mongoose");

//Defines the product schema

const ProductSchema = new mongoose.Schema(
    {
        title: { type: String, required:true, unique:true },
        desc: { type: String, required:true },
        img: { type: String, required:true },
        categories: { type: Array },
        price: { type: Number, required:true },
        inStock: { type: Boolean, default: true },
        quantity: {type: Number, default: 0, required: true }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema)