// backend/routes/ogrenciRoutes.js

const express = require('express');
const router = express.Router();
// Veritabanı bağlantınızı ve sorgu çalıştırma yönteminizi buraya import edin
// Örnek olarak `db.query` kullanılmıştır, kendi yapınıza göre uyarlayın.
 const db = require('../config/db'); // Örnek veritabanı bağlantısı

// --- Öğrenci Controller Mantığı ---
// Gerçek uygulamada bu mantığı ayrı controller dosyalarına taşımak daha iyi bir pratiktir.

// GET /api/ogrenciler - Tüm öğrencileri listele
router.get('/', async (req, res) => {
    try {
         const [rows] = await db.query('SELECT * FROM ogrenci '); // Kendi DB sorgunuzu yazın
        // Örnek Veri (Veritabanı bağlantısı olmadan test için)
        /* const rows = [
            { id: 1, ad: 'Ali', soyad: 'Veli', sinif: '10-A', numara: '101', veli_id: 5 },
            { id: 2, ad: 'Ayşe', soyad: 'Fatma', sinif: '11-B', numara: '202', veli_id: 6 },
            { id: 3, ad: 'Mehmet', soyad: 'Demir', sinif: '9-C', numara: '303', veli_id: 7 },
        ]; */
        console.log("GET /api/ogrenci - Öğrenciler getirildi:", rows.length);
        res.json(rows);
    } catch (error) {
        console.error('Öğrencileri listelerken hata:', error);
        res.status(500).json({ message: 'Öğrenciler getirilirken bir sunucu hatası oluştu.' });
    }
});

// POST /api/ogrenciler - Yeni öğrenci ekle
router.post('/', async (req, res) => {
    const { ad, soyad, sinif, numara, veli_id } = req.body;
    console.log("POST /api/ogrenciler - Gelen veri:", req.body);

    if (!ad || !soyad || !numara) {
        return res.status(400).json({ message: 'Ad, Soyad ve Numara alanları zorunludur.' });
    }

    try {
         const query = 'INSERT INTO ogrenci (ad, soyad, sinif, numara, veli_id) VALUES (?, ?, ?, ?, ?)';
         const [result] = await db.query(query, [ad, soyad, sinif, numara, veli_id]); // Kendi DB sorgunuzu yazın
        // Örnek Yanıt (Veritabanı bağlantısı olmadan test için)
       

        console.log("POST /api/ogrenciler - Öğrenci eklendi, ID:", result);
        res.status(201).json({  ad, soyad, sinif, numara, veli_id, message: 'Öğrenci başarıyla eklendi.' });
    } catch (error) {
        console.error('Öğrenci eklerken hata:', error);
        // Numara unique constraint hatası kontrolü (MySQL için error code 1062)
        if (error.code === 'ER_DUP_ENTRY' || error.message.includes('UNIQUE constraint failed')) {
             return res.status(409).json({ message: 'Bu öğrenci numarası zaten kayıtlı.' });
        }
        res.status(500).json({ message: 'Öğrenci eklenirken bir sunucu hatası oluştu.' });
    }
});

// PUT /api/ogrenciler/:id - Öğrenci güncelle
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { ad, soyad, sinif, numara, veli_id } = req.body;
    console.log(`PUT /api/ogrenciler/${id} - Gelen veri:`, req.body);

    if (!ad || !soyad || !numara) {
        return res.status(400).json({ message: 'Ad, Soyad ve Numara alanları zorunludur.' });
    }

    try {
         const query = 'UPDATE ogrenci SET ad = ?, soyad = ?, sinif = ?, numara = ?, veli_id = ? WHERE id = ?';
         const [result] = await db.query(query, [ad, soyad, sinif, numara, veli_id, id]); // Kendi DB sorgunuzu yazın
        // Örnek Yanıt (Veritabanı bağlantısı olmadan test için)
        

        if (result.affectedRows === 0) {
            console.log(`PUT /api/ogrenciler/${id} - Öğrenci bulunamadı.`);
            return res.status(404).json({ message: 'Güncellenecek öğrenci bulunamadı.' });
        }
        console.log(`PUT /api/ogrenciler/${id} - Öğrenci güncellendi.`);
        res.json({ id: parseInt(id, 10), ad, soyad, sinif, numara, veli_id, message: 'Öğrenci başarıyla güncellendi.' });
    } catch (error) {
        console.error(`Öğrenci (ID: ${id}) güncellenirken hata:`, error);
         // Numara unique constraint hatası kontrolü
        if (error.code === 'ER_DUP_ENTRY' || error.message.includes('UNIQUE constraint failed')) {
             return res.status(409).json({ message: 'Bu öğrenci numarası zaten başka bir öğrenciye ait.' });
        }
        res.status(500).json({ message: 'Öğrenci güncellenirken bir sunucu hatası oluştu.' });
    }
});

// DELETE /api/ogrenciler/:id - Öğrenci sil
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    console.log(`DELETE /api/ogrenci/${id} - Silme isteği alındı.`);

    try {
         const query = 'DELETE FROM ogrenci WHERE id = ?';
         const [result] = await db.query(query, [id]); // Kendi DB sorgunuzu yazın
       

        if (result.affectedRows === 0) {
             console.log(`DELETE /api/ogrenciler/${id} - Öğrenci bulunamadı.`);
            return res.status(404).json({ message: 'Silinecek öğrenci bulunamadı.' });
        }
        console.log(`DELETE /api/ogrenciler/${id} - Öğrenci silindi.`);
        res.json({ message: 'Öğrenci başarıyla silindi.' });
    } catch (error) {
        console.error(`Öğrenci (ID: ${id}) silinirken hata:`, error);
        res.status(500).json({ message: 'Öğrenci silinirken bir sunucu hatası oluştu.' });
    }
});

module.exports = router;

// --- Express Ana Dosyanıza (server.js veya app.js) Ekleyin ---
/*
const express = require('express');
const cors = require('cors'); // Farklı portlardan istekler için
const ogrenciRoutes = require('./routes/ogrenciRoutes'); // Rota dosyasının yolu

const app = express();
const PORT = process.env.PORT || 5000; // Backend için farklı bir port

// Middleware
app.use(cors()); // Frontend'den gelen isteklere izin ver
app.use(express.json()); // Gelen JSON verilerini işle

// Ana Rota
app.get('/', (req, res) => {
  res.send('Öğrenci Takip Sistemi Backend Çalışıyor!');
});

// API Rotaları
app.use('/api/ogrenciler', ogrenciRoutes); // Öğrenci rotalarını /api/ogrenciler altına ekle

// Hata Yönetimi (Basit)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Bir şeyler ters gitti!');
});

app.listen(PORT, () => {
  console.log(`Backend sunucusu ${PORT} portunda çalışıyor.`);
});
*/
