const { generateToken } = require("./jwt-helper");
const { createHmac } = require("crypto");
const { query, escape } = require('../db');


function hashPassword(password) {
    return createHmac("sha512", process.env.TOKEN_SECRET)
        .update(password)
        .digest("hex");
}

async function login(req, res, next) {
    const { username, password } = req.body;

    const rows = await query(`SELECT username, password, passed_test_id FROM users WHERE username = ?`, [username]);

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


async function tryy(req, res, next) {

    const questionId = 31;
    const answerIds = [64, 65];
    const escapedIds = await Promise.all(answerIds.map(async(id) => await escape(id))) ;
    
    // const rows = await query(`SELECT username, password, passed_test_id FROM users WHERE username = ?`, [username]);
    // console.log('rows', rows);
    const deleteNotFoundAnswers = await query(`SELECT * FROM answers A
                        WHERE A.id NOT IN (${escapedIds}) AND A.question_id = ?`,
                        [questionId]);
    console.log('deleteNotFoundAnswers', {deleteNotFoundAnswers, escapedIds});

    res.json({ try: 'abc', deleteNotFoundAnswers });
}

module.exports = {
    login,
    register,
    giveHash,
    tryy,
    hashPassword
}

