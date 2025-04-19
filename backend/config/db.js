// server/config/db.js
const mysql = require('mysql2/promise');
require('dotenv').config(); // .env dosyasındaki değişkenleri yükler

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'ogrencitakipvelibilgilendirme',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Bağlantıyı test et (opsiyonel)
pool.getConnection()
  .then(connection => {
    console.log('MySQL veritabanına başarıyla bağlanıldı.');
    connection.release();
  })
  .catch(err => {
    console.error('MySQL bağlantı hatası:', err);
  });

module.exports = pool;