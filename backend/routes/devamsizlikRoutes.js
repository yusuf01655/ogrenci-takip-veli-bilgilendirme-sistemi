const express = require('express');
const router = express.Router();
const db = require('../config/db');

// 2. Belirli bir sınıftaki öğrencileri getir
router.get('/ogrenciler/:sinif_id', async (req, res) => {
const sinifId = parseInt(req.params.sinif_id, 10); // Ensure it's an integer
const query = 'SELECT * FROM ogrenci WHERE sinif_id = ?';

    try {
        const [rows] = await db.query(query, [sinifId]);
        console.log("Öğrenciler getirildi:", rows);
        console.log("Querying sinif_id:", sinifId);
        res.json(rows);
    } catch (error) {
        console.error("Öğrenciler getirilirken hata:", error);
        res.status(500).json({ message: 'Sunucu hatası: Öğrenciler alınamadı.' });
    }
});

// 3. Belirli bir öğrencinin tüm devamsızlıklarını getir
router.get('/ogrenci/:ogrenciId', async (req, res) => {
    const { ogrenciId } = req.params;
    try {
        const [rows] = await db.query("SELECT * FROM devamsizlik WHERE ogrenci_id = ? ORDER BY devamsizlik_tarihi DESC", [ogrenciId]);
        res.json(rows);
    } catch (error) {
        console.error("Devamsızlıklar getirilirken hata:", error);
        res.status(500).json({ message: 'Sunucu hatası: Devamsızlıklar alınamadı.' });
    }
});

// 4. Yeni bir devamsızlık ekle
router.post('/devamsizliklar', async (req, res) => {
    const { ogrenci_id, devamsizlik_tarihi, devamsizlik_turu, aciklama } = req.body;
    try {
        const [result] = await db.query(
            "INSERT INTO devamsizlik (ogrenci_id, devamsizlik_tarihi, devamsizlik_turu, aciklama) VALUES (?, ?, ?, ?)",
            [ogrenci_id, devamsizlik_tarihi, devamsizlik_turu, aciklama]
        );
        res.status(201).json({ id: result.insertId, message: 'Devamsızlık başarıyla eklendi.' });
    } catch (error) {
        console.error("Devamsızlık eklenirken hata:", error);
        res.status(500).json({ message: 'Sunucu hatası: Devamsızlık eklenemedi.' });
    }
});

// 5. Mevcut bir devamsızlığı güncelle
router.put('/devamsizliklar/:id', async (req, res) => {
    const { id } = req.params;
    const { devamsizlik_tarihi, devamsizlik_turu, aciklama } = req.body;
    try {
        await db.query(
            "UPDATE devamsizlik SET devamsizlik_tarihi = ?, devamsizlik_turu = ?, aciklama = ? WHERE id = ?",
            [devamsizlik_tarihi, devamsizlik_turu, aciklama, id]
        );
        res.json({ message: 'Devamsızlık başarıyla güncellendi.' });
    } catch (error) {
        console.error("Devamsızlık güncellenirken hata:", error);
        res.status(500).json({ message: 'Sunucu hatası: Devamsızlık güncellenemedi.' });
    }
});

// 6. Bir devamsızlığı sil
router.delete('/devamsizliklar/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query("DELETE FROM devamsizlik WHERE id = ?", [id]);
        res.json({ message: 'Devamsızlık başarıyla silindi.' });
    } catch (error) {
        console.error("Devamsızlık silinirken hata:", error);
        res.status(500).json({ message: 'Sunucu hatası: Devamsızlık silinemedi.' });
    }
});




module.exports = router;
