// routes/messages.js
const express = require('express');
const router = express.Router();
const pool = require('../config/db'); // Assuming your db connection pool is in db.js
// const authenticateToken = require('../middleware/auth'); // Optional: If you need authentication

// GET all messages (as per your initial request)
router.get('/', async (req, res) => {
  try {
    // For now, selecting all messages as requested.
    // For a real inbox, you'd filter by alici_id.
    const [rows] = await pool.query('SELECT mesaj_id, gonderen_id, alici_id, konu, icerik, gonderim_tarihi FROM messages ORDER BY gonderim_tarihi DESC'); // Assuming you have a timestamp column like 'gonderim_tarihi'

    // It's good practice to map database column names to frontend-friendly names if they differ.
    // Your React code expects fields like 'id', 'from', 'subject', 'preview', 'timestamp'.
    const formattedMessages = rows.map(msg => ({
      id: msg.mesaj_id,
      // For 'from', you'd typically join with a users table to get a name/email instead of just gonderen_id
      // For simplicity here, we'll just pass the ID. You'll need to adapt this.
      from: `User ${msg.gonderen_id}`, // Placeholder: Resolve gonderen_id to a name/email
      to: `User ${msg.alici_id}`,       // Placeholder: Resolve alici_id for sent items
      subject: msg.konu,
      preview: msg.icerik.substring(0, 100) + (msg.icerik.length > 100 ? '...' : ''), // Create a preview
      body: msg.icerik, // Full content
      timestamp: msg.gonderim_tarihi ? new Date(msg.gonderim_tarihi).toLocaleString() : new Date().toLocaleString(), // Format timestamp
      read: false // You'll need a 'read_status' column in your DB for this
    }));

    res.json({ success: true, messages: formattedMessages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch messages', error: error.message });
  }
});

// GET inbox messages for a specific user (More typical inbox behavior)
// Example: /api/messages/inbox/:userId or get userId from auth token
router.get('/inbox', /* authenticateToken, */ async (req, res) => {
  // const userId = req.user.id; // If using authentication to get the logged-in user's ID
  const aliciId = req.query.userId; // Or pass as a query parameter for now

  if (!aliciId) {
    return res.status(400).json({ success: false, message: 'User ID (alici_id) is required.' });
  }

  try {
    // Use parameterized query to prevent SQL injection
    const query = 'SELECT m.mesaj_id, m.gonderen_id, u_gonderen.id AS gonderen_kullanici_adi, m.alici_id, m.konu, m.icerik, m.gonderildi, m.okundu FROM mesaj m LEFT JOIN user u_gonderen ON m.gonderen_id = u_gonderen.id WHERE m.alici_id = ? ORDER BY m.gonderildi DESC';
    // Add an INDEX on `alici_id` and `gonderim_tarihi` in your MySQL table for performance:
    // CREATE INDEX idx_alici_tarih ON messages (alici_id, gonderim_tarihi DESC);
    // CREATE INDEX idx_gonderen_tarih ON messages (gonderen_id, gonderim_tarihi DESC);

    const [rows] = await pool.query(query, [aliciId]);

    const formattedMessages = rows.map(msg => ({
      id: msg.mesaj_id,
      from: msg.gonderen_kullanici_adi || `User ${msg.gonderen_id}`, // Show username if available
      subject: msg.konu,
      preview: msg.icerik.substring(0, 100) + (msg.icerik.length > 100 ? '...' : ''),
      body: msg.icerik,
      timestamp: msg.gonderim_tarihi ? new Date(msg.gonderim_tarihi).toLocaleString() : 'N/A',
      read: msg.okundu_durumu || false // Assuming an 'okundu_durumu' BOOLEAN/TINYINT column
    }));
    res.json({ success: true, messages: formattedMessages });
  } catch (error) {
    console.error('Error fetching inbox messages:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch inbox messages', error: error.message });
  }
});

// You would also have an endpoint for 'sent' messages, filtering by `gonderen_id`
router.get('/sent', /* authenticateToken, */ async (req, res) => {
  // const userId = req.user.id;
  const gonderenId = req.query.userId;

  if (!gonderenId) {
    return res.status(400).json({ success: false, message: 'User ID (gonderen_id) is required.' });
  }

  try {
    const query = 'SELECT m.mesaj_id, m.alici_id, u_alici.username AS alici_kullanici_adi, m.konu, m.icerik, m.gonderildi FROM mesaj m LEFT JOIN user u_alici ON m.alici_id = u_alici.id WHERE m.gonderen_id = ? ORDER BY m.gonderildi DESC';
    const [rows] = await pool.query(query, [gonderenId]);
    const formattedMessages = rows.map(msg => ({
      id: msg.mesaj_id,
      to: msg.alici_kullanici_adi || `User ${msg.alici_id}`,
      subject: msg.konu,
      preview: msg.icerik.substring(0, 100) + (msg.icerik.length > 100 ? '...' : ''),
      body: msg.icerik,
      timestamp: msg.gonderim_tarihi ? new Date(msg.gonderim_tarihi).toLocaleString() : 'N/A',
    }));
    res.json({ success: true, messages: formattedMessages });
  } catch (error) {
    console.error('Error fetching sent messages:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch sent messages', error: error.message });
  }
});


module.exports = router;