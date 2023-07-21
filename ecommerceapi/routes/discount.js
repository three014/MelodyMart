const Discount = require("../models/Discount");
const router = require("express").Router();

//CREATE
router.post("/", async (req, res) => {
  const newDiscount = new Discount(req.body);

  try {
    const savedDiscount = await newDiscount.save();
    res.status(200).json(savedDiscount);
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE
router.put("/:id", async (req, res) => {
  try {
    const updatedDiscount = await Discount.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedDiscount);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE
router.delete("/:id", async (req, res) => {
  try {
    await Discount.findByIdAndDelete(req.params.id);
    res.status(200).json("Discount has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET PRODUCT
router.get("/find/:id", async (req, res) => {
  try {
    const discount = await Discount.findById(req.params.id);
    res.status(200).json(discount);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL DISCOUNTS
router.get("/", async (req, res) => {
  const qNew = req.query.new;
  const qCategory = req.query.category;
  try {
    let discounts;

    if (qNew) {
      discounts = await Discount.find().sort({ createdAt: -1 }).limit(1);
    } else if (qCategory) {
      discounts = await Discount.find({
        categories: {
          $in: [qCategory],
        },
      });
    } else {
      discounts = await Discount.find();
    }

    res.status(200).json(discounts);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
