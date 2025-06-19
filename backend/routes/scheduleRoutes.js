const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all lessons
router.get('/lessons', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM ders');
    res.json(results);
    console.log(results);
    
  } catch (err) {
    console.error('Error fetching lessons:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get all teachers
router.get('/teachers', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM ogretmen');
    res.json(results);
  } catch (err) {
    console.error('Error fetching teachers:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get all classes
router.get('/classes', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM sinif');
    res.json(results);
  } catch (err) {
    console.error('Error fetching classes:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get schedule for a class
router.get('/schedule/:classId', async (req, res) => {
  try {
    const { classId } = req.params;
    
    // First get the sinif_id from the sinif table using the class name
    const [classRows] = await db.query(
      'SELECT id FROM sinif WHERE ad = ?',
      [decodeURIComponent(classId)]
    );

    if (!classRows || classRows.length === 0) {
      return res.status(404).json({ message: 'Sınıf bulunamadı' });
    }

    const sinifId = classRows[0].id;

    const [results] = await db.query(
      `SELECT dp.id, dp.gun as day, dp.saat as period, 
              d.id as lesson_id, d.ad as lesson_name,
              o.id as teacher_id, o.adsoyad as teacher_name
       FROM ders_programi dp
       JOIN ders d ON dp.ders_id = d.id
       JOIN ogretmen o ON dp.ogretmen_id = o.id
       WHERE dp.sinif_id = ?`,
      [sinifId]
    );
    
    const transformedResults = results.map(row => ({
      day: row.day,
      period: row.period,
      lesson_id: row.lesson_id,
      lesson_name: row.lesson_name,
      teacher_id: row.teacher_id,
      teacher_name: row.teacher_name
    }));
    
    res.json(transformedResults);
  } catch (error) {
    console.error('Error fetching schedule:', error);
    res.status(500).json({ message: 'Error fetching schedule' });
  }
});

// Get schedule for a class by ID
router.get('/class/:classId', async (req, res) => {
    try {
        const { classId } = req.params;
        const [results] = await db.query(
            'SELECT * FROM ders_programi WHERE sinif_id = ?',
            [classId]
        );
        res.json(results);
    } catch (err) {
        console.error('Error fetching class schedule:', err);
        res.status(500).json({ error: err.message });
    }
});

// Add or update a schedule entry
router.post('/save', async (req, res) => {
  try {
    const { classId, day, period, lessonId, teacherId } = req.body;
    
    // Get the sinif_id from class name
    const [classRows] = await db.query(
      'SELECT id FROM sinif WHERE ad = ?',
      [classId]
    );

    if (!classRows || classRows.length === 0) {
      return res.status(404).json({ message: 'Sınıf bulunamadı' });
    }

    const sinifId = classRows[0].id;
    
    // First check if an entry exists
    const [existing] = await db.query(
      'SELECT id FROM ders_programi WHERE sinif_id = ? AND gun = ? AND saat = ?',
      [sinifId, day, period]
    );
    
    if (existing && existing.length > 0) {
      // Update existing entry
      await db.query(
        `UPDATE ders_programi 
         SET ders_id = ?, ogretmen_id = ?
         WHERE sinif_id = ? AND gun = ? AND saat = ?`,
        [lessonId, teacherId, sinifId, day, period]
      );
    } else {
      // Insert new entry
      await db.query(
        `INSERT INTO ders_programi (sinif_id, gun, saat, ders_id, ogretmen_id)
         VALUES (?, ?, ?, ?, ?)`,
        [sinifId, day, period, lessonId, teacherId]
      );
    }
    
    res.json({ message: 'Schedule updated successfully' });
  } catch (error) {
    console.error('Error saving schedule:', error);
    res.status(500).json({ message: 'Error saving schedule' });
  }
});

// Delete a schedule entry
router.post('/delete', async (req, res) => {
  try {
    const { classId, day, period } = req.body;
    
    // Get the sinif_id from class name
    const [classRows] = await db.query(
      'SELECT id FROM sinif WHERE ad = ?',
      [classId]
    );

    if (!classRows || classRows.length === 0) {
      return res.status(404).json({ message: 'Sınıf bulunamadı' });
    }

    const sinifId = classRows[0].id;

    await db.query(
      'DELETE FROM ders_programi WHERE sinif_id = ? AND gun = ? AND saat = ?',
      [sinifId, day, period]
    );
    res.json({ message: 'Schedule entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting schedule:', error);
    res.status(500).json({ message: 'Error deleting schedule' });
  }
});

module.exports = router;
