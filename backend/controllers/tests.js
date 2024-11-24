const db = require('../db');

async function getTests(req, res, next) {
    try {
        const rows = await db.query(`select * from tests`);
        res.json(rows);
    }
    catch (error) {
        res.status(500).json(error);
    }
}

module.exports = {
    getTests
}