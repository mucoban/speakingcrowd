const jwt = require("jsonwebtoken");
const db = require('../db');
const { hashPassword } = require("./auth");

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

async function setDetails(req, res) {
    try {

        const { fullname } = req.body;

        const token = req.headers.authorization && req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

        if (!fullname) return res.json({ status: false, message: 'fullname is missing' });

        const update = await db.query(`UPDATE  users U
            SET U.fullname = ?
            WHERE username = ?`, [fullname, decoded.username]);

        if (!update.changedRows) return res.json({ status: false, message: 'not saved' });

        res.json({ status: true, message: 'saved successfully' });
    }
    catch (error) {
        res.status(500).json(error);
    }
}

async function setPassword(req, res) {
    try {

        const { currentPassword, newPassword } = req.body;

        if (!currentPassword) return res.json({ status: false, message: 'currentPassword is missing' });
        if (!newPassword) return res.json({ status: false, message: 'newPassword is missing' });

        const token = req.headers.authorization && req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        const hashedCurrentPassword = hashPassword(currentPassword);
        const hashedNewPassword = hashPassword(newPassword);

        const update = await db.query(`UPDATE  users U
            SET U.password = ?
            WHERE username = ? AND password = ?`, 
            [hashedNewPassword, decoded.username, hashedCurrentPassword]);

        if (!update.changedRows) return res.json({ status: false, message: 'not saved' });

        res.json({ status: true, message: 'saved successfully' });
    }
    catch (error) {
        res.status(500).json(error);
    }
}

module.exports = {
    getDetails,
    setDetails,
    setPassword
}