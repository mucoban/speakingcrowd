const jwt = require("jsonwebtoken");
const db = require('../db');

async function getDetails(req, res) {
    try {
        const token = req.headers.authorization && req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

        const users = await db.query(`SELECT
            U.username, U.passed_test_id as passedTestId, U.fullname,
            T.name as currentTestName
            FROM users U, tests T
            WHERE username = ? AND T.id = U.passed_test_id`, [decoded.username]);    

        return res.json(users?.[0]);
    }
    catch (error) {
        res.status(500).json(error);
    }
}

module.exports = {
    getDetails
}