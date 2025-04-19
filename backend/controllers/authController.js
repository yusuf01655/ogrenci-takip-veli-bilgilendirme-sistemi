// server/controllers/authController.js
const bcrypt = require('bcrypt');
const pool = require('../config/db'); // Veritabanı havuzu

const registerUser = async (req, res) => {
    const { username, password, role } = req.body;

    try {
        // 1. Kullanıcı adı veritabanında var mı kontrol et
        const [existingUsers] = await pool.execute(
            'SELECT username FROM users WHERE username = ?',
            [username]
        );

        if (existingUsers.length > 0) {
            return res.status(409).json({ message: 'Bu kullanıcı adı zaten kullanılıyor.' }); // 409 Conflict
        }

        // 2. Şifreyi hashle
        const saltRounds = 10; // Güvenlik seviyesi (genellikle 10-12 arası)
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // 3. Yeni kullanıcıyı veritabanına kaydet (SQL Injection önlenmiş şekilde)
        const [result] = await pool.execute(
            'INSERT INTO users (username, password, rol) VALUES (?, ?, ?)',
            [username, hashedPassword, role]
        );

        console.log('Yeni kullanıcı kaydedildi:', result.insertId);

        // Başarılı yanıt gönder
        res.status(201).json({ message: 'Kullanıcı başarıyla kaydedildi.' }); // 201 Created

    } catch (error) {
        console.error('Kayıt sırasında hata:', error);
        res.status(500).json({ message: 'Sunucu hatası oluştu. Kayıt yapılamadı.' });
    }
};

module.exports = {
    registerUser,
    // Login fonksiyonu zaten varsayıldığı için buraya eklenmedi
};