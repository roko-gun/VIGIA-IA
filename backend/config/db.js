const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'admin123',
  database: process.env.DB_NAME || 'vigia_ia'
});

connection.connect((err) => {
  if (err) {
    console.error('Error de conexión:', err.message);
    return;
  }
  console.log('Conectado a la base de datos');
});

module.exports = connection;
