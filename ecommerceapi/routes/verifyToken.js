const jwt = require("jsonwebtoken");

//Exports three middleware functions to handle token verification and user authorization for protected routes in a Node.js application 

const verifyToken = (req,res,next) => {
    const authHeader = req.headers.token;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_SECRET, (err,user) => {
            if(err) res.status(401).json("Token is not valid!");
            req.user = user;
            next();
        });
    }else{
        return res.status(401).json("You are not authenticated!");
    }
};

const verifyTokenAndAuthorization = (req,res,next) => {
    verifyToken(req, res, () => {
        if(req.user.id === req.params.id || req.user.isAdmin){
            next()
        }else{
            res.status(403).json("You are not allowed to do that!");
        }
    });
};

const verifyTokenAndAdmin = (req,res,next) => {
    verifyToken(req, res, () => {
        if(req.user.isAdmin) {
            next()
        }else{
            res.status(403).json("You are not allowed to do that!");
        }
    });
};

module.exports = { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin };
