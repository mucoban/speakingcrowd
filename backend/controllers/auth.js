const { generateToken } = require("./jwt-helper");
const { createHmac } = require("crypto");
const { query } = require('../db');
const { log } = require("console");


function hashPassword(password) {
    return createHmac("sha512", process.env.TOKEN_SECRET)
        .update(password)
        .digest("hex");
}


async function login(req, res, next) {
    const { username, password } = req.body;

    const rows = await query(`SELECT username, password FROM users WHERE username = ?`, [username]);

    if (!rows?.length) {
        return res.status(400).send("username or password wrong 2");
    }

    const user = rows[0];

    const hashedPassword = hashPassword(password);

    if (hashedPassword !== user.password) {
        return res.status(400).send("username or password wrong");
    }

    delete user.password;
    const token = generateToken(user);

    res.json({ token });
}

async function register(req, res, next) {
    const { username, password } = req.body;

    const hashedPassword = hashPassword(password);

    const result = await query(`INSERT INTO users SET username = ?, password = ?`, [username, hashedPassword]);

    if (!result?.affectedRows) return res.status(400).json({ message: "user couldn't be created" });

    res.status(201).json({ message: "user created" });
}

async function giveHash(req, res, next) {
    const { password } = req.query;
    console.log( password );
    const hash = createHmac("sha512", process.env.TOKEN_SECRET)
        .update(password)
        .digest("hex");

    res.json({ hash });
}

module.exports = {
    login,
    register,
    giveHash
}

