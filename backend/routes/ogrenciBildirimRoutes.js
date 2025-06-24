// backend/routes/ogrenciRoutes.js

const express = require('express');
const router = express.Router();
// Veritabanı bağlantınızı ve sorgu çalıştırma yönteminizi buraya import edin
// Örnek olarak `db.query` kullanılmıştır, kendi yapınıza göre uyarlayın.
 const db = require('../config/db'); // Örnek veritabanı bağlantısı

// --- Öğrenci Controller Mantığı ---
// Gerçek uygulamada bu mantığı ayrı controller dosyalarına taşımak daha iyi bir pratiktir.

// GET /api/ogrencibildirim - Tüm öğrencileri listele veya userId'ye göre filtrele
router.get('/', async (req, res) => {
    try {
        const { userId } = req.query;
        console.log("GET /api/ogrencibildirim - Gelen userId:", userId);
        console.log("Tüm query:", req.query);
        if (userId) {
            // Önce bu userId'ye sahip öğrencilerin id'lerini bul
            const [ogrenciler] = await db.query('SELECT id FROM ogrenci WHERE user_id = ?', [userId]);
            const ogrenciIds = ogrenciler.map(o => o.id);
            if (ogrenciIds.length === 0) {
                return res.json([]); // Bu userId'ye ait öğrenci yoksa boş dön
            }
            // Sadece bu öğrencilere ait bildirimleri getir
            const [rows] = await db.query('SELECT * FROM bildirim WHERE ogrenci_id IN (?)', [ogrenciIds]);
            console.log("GET /api/ogrencibildirim - userId ile filtreli bildirimler getirildi:", rows.length);
            console.log(ogrenciIds)
            return res.json(rows);
        } else {
            // userId yoksa tüm bildirimleri getir
            const [rows] = await db.query('SELECT * FROM bildirim');
            
            console.log("GET /api/ogrencibildirim - bildirimler getirildi:", rows.length);
            return res.json(rows);
        }
    } catch (error) {
        console.error('bildirimler listelerken hata:', error);
        res.status(500).json({ message: 'bildirimler getirilirken bir sunucu hatası oluştu.' });
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

