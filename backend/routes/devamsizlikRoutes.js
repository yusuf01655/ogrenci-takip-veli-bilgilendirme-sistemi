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
        // Bildirim ekle
        const notificationSql = `
            INSERT INTO bildirim (bildirim_icerigi, bildirim_turu_id, ogrenci_id)
            VALUES (?, ?, ?);
        `;
        const notificationContent = `Yeni devamsızlık eklendi: Tarih ${devamsizlik_tarihi}, Tür: ${devamsizlik_turu}`;
        await db.query(notificationSql, [notificationContent, 2, ogrenci_id]);
        res.status(201).json({ id: result.insertId, message: 'Devamsızlık başarıyla eklendi ve bildirim oluşturuldu.' });
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
        // Bildirim için önce ogrenci_id alınmalı
        const [rows] = await db.query('SELECT ogrenci_id FROM devamsizlik WHERE id = ?', [id]);
        if (rows.length > 0) {
            const ogrenci_id = rows[0].ogrenci_id;
            const notificationSql = `
                INSERT INTO bildirim (bildirim_icerigi, bildirim_turu_id, ogrenci_id)
                VALUES (?, ?, ?);
            `;
            const notificationContent = `Devamsızlık güncellendi: Tarih ${devamsizlik_tarihi}, Tür: ${devamsizlik_turu}`;
            await db.query(notificationSql, [notificationContent, 2, ogrenci_id]);
        }
        res.json({ message: 'Devamsızlık başarıyla güncellendi ve bildirim oluşturuldu.' });
    } catch (error) {
        console.error("Devamsızlık güncellenirken hata:", error);
        res.status(500).json({ message: 'Sunucu hatası: Devamsızlık güncellenemedi.' });
    }
});

// 6. Bir devamsızlığı sil
router.delete('/devamsizliklar/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // Bildirim için önce ogrenci_id alınmalı
        const [rows] = await db.query('SELECT ogrenci_id FROM devamsizlik WHERE id = ?', [id]);
        let ogrenci_id = null;
        if (rows.length > 0) {
            ogrenci_id = rows[0].ogrenci_id;
        }
        await db.query("DELETE FROM devamsizlik WHERE id = ?", [id]);
        if (ogrenci_id) {
            const notificationSql = `
                INSERT INTO bildirim (bildirim_icerigi, bildirim_turu_id, ogrenci_id)
                VALUES (?, ?, ?);
            `;
            const notificationContent = `Devamsızlık kaydınız silindi.`;
            await db.query(notificationSql, [notificationContent, 2, ogrenci_id]);
        }
        res.json({ message: 'Devamsızlık başarıyla silindi ve bildirim oluşturuldu.' });
    } catch (error) {
        console.error("Devamsızlık silinirken hata:", error);
        res.status(500).json({ message: 'Sunucu hatası: Devamsızlık silinemedi.' });
    }
});




module.exports = router;
