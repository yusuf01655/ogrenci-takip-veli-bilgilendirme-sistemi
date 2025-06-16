const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get schedule for a class by sinif_id
router.get('/schedule/:sinif_id', (req, res) => {
  const { sinif_id } = req.params;
  db.query(
    `SELECT dp.id, dp.gun, dp.saat, d.ad as lesson, o.adsoyad as teacher
     FROM ders_programi dp
     JOIN ders d ON dp.ders_id = d.id
     JOIN ogretmen o ON dp.ogretmen_id = o.id
     WHERE dp.sinif_id = ?`,
    [sinif_id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    }
  );
});

// Add or update a lesson
router.post('/', (req, res) => {
  const { sinif, gun, ders_saati, ders_adi, ogretmen } = req.body;
  db.query(
    `INSERT INTO ders_programi (sinif, gun, ders_saati, ders_adi, ogretmen)
     VALUES (?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE ders_adi = VALUES(ders_adi), ogretmen = VALUES(ogretmen)`,
    [sinif, gun, ders_saati, ders_adi, ogretmen],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ success: true });
    }
  );
});

// Delete a lesson
router.delete('/', (req, res) => {
  const { sinif, gun, ders_saati } = req.body;
  db.query(
    'DELETE FROM ders_programi WHERE sinif = ? AND gun = ? AND ders_saati = ?',
    [sinif, gun, ders_saati],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ success: true });
    }
  );
});
// Get all classes
router.get('/classes', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM sinif');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

// Get all teachers
router.get('/teachers', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM ogretmen');
    res.json(results);
    console.log(results);
  } catch (err) {
    return res.status(500).json({ error: err });
  }
});

// Get all lessons
router.get('/lessons', (req, res) => {
  db.query('SELECT * FROM ders', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// Get schedule for a class
router.get('/schedule/:classId', (req, res) => {
  const { classId } = req.params;
  db.query(
    `SELECT dp.id, dp.gun, dp.saat, d.ad as lesson, o.adsoyad as teacher
     FROM ders_programi dp
     JOIN ders d ON dp.ders_id = d.id
     JOIN ogretmen o ON dp.ogretmen_id = o.id
     WHERE dp.sinif_id = ?`,
    [classId],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    }
  );
});

// Add or update a schedule entry
router.post('/schedule', (req, res) => {
  const { sinif_id, ogretmen_id, ders_id, gun, saat } = req.body;
  // Check if entry exists
  db.query(
    'SELECT id FROM ders_programi WHERE sinif_id=? AND gun=? AND saat=?',
    [sinif_id, gun, saat],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      if (results.length > 0) {
        // Update
        db.query(
          'UPDATE ders_programi SET ogretmen_id=?, ders_id=? WHERE id=?',
          [ogretmen_id, ders_id, results[0].id],
          (err2) => {
            if (err2) return res.status(500).json({ error: err2 });
            res.json({ success: true, updated: true });
          }
        );
      } else {
        // Insert
        db.query(
          'INSERT INTO ders_programi (sinif_id, ogretmen_id, ders_id, gun, saat) VALUES (?, ?, ?, ?, ?)',
          [sinif_id, ogretmen_id, ders_id, gun, saat],
          (err2) => {
            if (err2) return res.status(500).json({ error: err2 });
            res.json({ success: true, inserted: true });
          }
        );
      }
    }
  );
});

// Delete a schedule entry
router.delete('/schedule/:id', (req, res) => {
  db.query('DELETE FROM ders_programi WHERE id=?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ success: true });
  });
});
module.exports = router;
