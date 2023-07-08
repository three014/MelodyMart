const User = require("../models/User");
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");

const router = require("express").Router();

router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
    if(req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(
            req.body.password, 
            process.env.PASSWORD_SECRET
        ).toString();
    }
    try{
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body
            },
            { new:true }
        );
        res.status(200).json(updatedUser);
    }catch (err) {
        res.status(500).json(err);
    }
});

// Delete
router.delete("/find/:id", verifyTokenAndAuthorization, async (req,res) => {
    try{
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User has been deleted...");
    }catch{
        res.status(500).json(err);
    }
});

// Get User
router.get("/:id", verifyTokenAndAdmin, async (req,res) => {
    try{
        const user = await User.findById(req.params.id);
        const { password, ...others } = user._doc;
        res.status(200).json(others);
    }catch{
        res.status(500).json(err);
    }
});

// Get All Users
router.get("/", verifyTokenAndAdmin, async (req,res) => {
    const query = req.query.new
    try{
        const users = query
            ? await User.find().sort({ _id:-1 }).limit(5)
            : await User.find();
        res.status(200).json(users);
    }catch{
        res.status(500).json(err);
    }
});

// Get User Stats
router.get("/stats", verifyTokenAndAdmin, async (req,res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
    try{
        const data = await User.aggregate([
            { $match: {createdAt: { $gte: lastYear } } },
            {
                $project: {
                    month: { $month: "$createdAt" },
                },
            },
            {
                $group: {
                    _id: "month",
                    total: { $sum: 1 },
                },
            },
        ]);
        res.status(200).json(data);
    }catch(err){
        res.status(500).json(err);
    }
});

// Test
router.get("/usertest", (req,res)=>{
    res.send("user test is successful");
});

router.post("/userposttest", (req,res)=>{
    const username = req.body.username
    res.send("your username is: " + username);
});

module.exports = router;
