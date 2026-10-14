const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: 'admin123',
    database: "vigia_ia"
});

connection.connect((err) => {
    if (err) {
        console.error("Error de conexion:", err);
        return;
    }

    console.log("Conectado a MariaDB");
});

module.exports = connection;