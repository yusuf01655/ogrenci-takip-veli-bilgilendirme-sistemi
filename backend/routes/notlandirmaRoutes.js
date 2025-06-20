const express = require('express');
const router = express.Router();
const db = require('../config/db');
// Router'a veritabanı bağlantısını (db) aktarmak 


    // GET: Tüm sınıfları getirir
    router.get('/siniflar', async (req, res) => {
        try {
            const [rows] = await db.query('SELECT * FROM sinif ORDER BY ad');
            res.json(rows);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Sunucu hatası: Sınıflar alınamadı.' });
        }
    });

    // GET: Tüm dersleri getirir
    router.get('/dersler', async (req, res) => {
        try {
            const [rows] = await db.query('SELECT * FROM ders ORDER BY ad');
            res.json(rows);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Sunucu hatası: Dersler alınamadı.' });
        }
    });
    
    // GET: Belirli bir sınıftaki öğrencileri ve o dersteki notlarını getirir
    router.get('/ogrenciler-ve-notlar/:sinifId/:dersId', async (req, res) => {
        const { sinifId, dersId } = req.params;
        try {
            const sql = `
                SELECT 
                    o.id as ogrenci_id, 
                    o.okul_no, 
                    o.ad, 
                    o.soyad, 
                    n.id as not_id, 
                    n.sinav1, 
                    n.sinav2
                FROM ogrenci o
                LEFT JOIN ogrenci_not n ON o.id = n.ogrenci_id AND n.ders_id = ?
                WHERE o.sinif_id = ?
                ORDER BY o.soyad, o.ad;
            `;
            const [rows] = await db.query(sql, [dersId, sinifId]);
            res.json(rows);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Sunucu hatası: Öğrenci ve not bilgileri alınamadı.' });
        }
    });

    // POST: Yeni bir not ekler veya var olanı günceller (UPSERT)
    router.post('/notlar', async (req, res) => {
        const { ogrenci_id, ders_id, sinav1, sinav2 } = req.body;
        
        // Gelen verinin doğruluğunu kontrol et
        if(!ogrenci_id || !ders_id) {
            return res.status(400).json({ message: 'Öğrenci ID ve Ders ID gereklidir.' });
        }

        try {
            const sql = `
                INSERT INTO ogrenci_not (ogrenci_id, ders_id, sinav1, sinav2)
                VALUES (?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE sinav1 = VALUES(sinav1), sinav2 = VALUES(sinav2);
            `;
            const [result] = await db.query(sql, [ogrenci_id, ders_id, sinav1, sinav2]);
            res.status(201).json({ message: 'Not başarıyla kaydedildi.', insertId: result.insertId });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Sunucu hatası: Not kaydedilemedi.' });
        }
    });
    
    // PUT: Var olan bir notu günceller
    router.put('/notlar/:notId', async (req, res) => {
        const { notId } = req.params;
        const { sinav1, sinav2 } = req.body;

        try {
            const sql = 'UPDATE ogrenci_not SET sinav1 = ?, sinav2 = ? WHERE id = ?';
            const [result] = await db.query(sql, [sinav1, sinav2, notId]);
            if (result.affectedRows === 0) {
                 return res.status(404).json({ message: 'Güncellenecek not bulunamadı.' });
            }
            res.json({ message: 'Not başarıyla güncellendi.' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Sunucu hatası: Not güncellenemedi.' });
        }
    });


    // DELETE: Bir not kaydını siler
    router.delete('/notlar/:notId', async (req, res) => {
        const { notId } = req.params;
        try {
            const [result] = await db.query('DELETE FROM ogrenci_not WHERE id = ?', [notId]);
            if(result.affectedRows === 0) {
                return res.status(404).json({ message: 'Silinecek not bulunamadı.' });
            }
            res.json({ message: 'Not başarıyla silindi.' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Sunucu hatası: Not silinemedi.' });
        }
    });

module.exports = router;