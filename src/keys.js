/* Exporta un archivo con las configuraciones 
para conectarse a la base de datos */
module.exports = {
    database: {
        host:  process.env.HOST,
        user: process.env.USER_DB,
        password: process.env.PASSWORD_DB,
        database: process.env.DATABASE
    }
}