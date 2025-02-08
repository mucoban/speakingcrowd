const jwt = require("jsonwebtoken");

exports.generateToken = (userInfo) => {
    return jwt.sign(userInfo, process.env.TOKEN_SECRET, {
        expiresIn: "3h"
    });
}

exports.checkAuthentication = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(" ")[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}