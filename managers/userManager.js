var sql = require('mssql');
var poolConnection = require('../config/sqlPool');  


exports.createUser = async(req) => {
    try {
        const pool = await poolConnection.getPoolConnection();
        let result = await pool.request()
            .input('nombre',         sql.VarChar(30), req.nombre)
            .input('primerApellido', sql.VarChar(30), req.primerApellido)
            .input('correo',         sql.VarChar(30), req.correo)
            .input('edad',           sql.Int,         req.edad)
            .output('success', sql.Bit)
            .execute('sp_createUser');
        sql.close();
        console.log(result, 'resultado');
        return result;
    } catch (err) {
        console.log(err)
        sql.close();
        return "Error en " + err;
    }
}

sql.on('error', err => {
    console.log(err);
})