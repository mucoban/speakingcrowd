const mysql = require('mysql2/promise');
const config = require('./config');

async function query(sql, params) {
  try {
    const connection = await mysql.createConnection(config.db);
    const [results] = await connection.execute(sql, params);
    return results;
  } catch (error) {
    console.log(error);
  }
}

async function escape(value) {
  try {
    const connection = await mysql.createConnection(config.db);
    return connection.escape(value);
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = {
  query,
  escape
}