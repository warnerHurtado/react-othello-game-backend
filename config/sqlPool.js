const sql = require('mssql');
const sqlconfig = require('./connectionSQL');
let dbConnPool = null;

const getPoolConnection = () => {
    if (dbConnPool) return dbConnPool;
    dbConnPool = new Promise((resolve, reject) => {
        const conn = new sql.ConnectionPool(sqlconfig);
        conn.on('close', () => {
            dbConnPool = null;
        });
        conn.connect()
            .then(pool => {
                console.log("SQL connected.");
                return resolve(pool);
            })
            .catch(err => {
                dbConnPool = null;
                return reject(err);
            });
    });
    return dbConnPool;
}
module.exports = { sql, getPoolConnection };
