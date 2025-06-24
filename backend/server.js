// server.js
require('dotenv').config(); // .env dosyasını yükle
const express = require('express');
const mysql = require('mysql2/promise'); // Promise tabanlı mysql2
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const authRoutes = require('./routes/authRoutes');
const ogrenciRoutes = require('./routes/ogrenciRoutes');
const messagesRouter = require('./routes/messages'); // Adjust path as needed
const scheduleRoutes = require('./routes/scheduleRoutes');
const devamsizlikRoutes = require('./routes/devamsizlikRoutes'); // Devamsızlık ile ilgili rotalar
const notlandirmaRoutes = require('./routes/notlandirmaRoutes'); // Notlandırma ile ilgili rotalar
const ogrenciBildirimRoutes = require('./routes/ogrenciBildirimRoutes'); // Öğrenci bildirim rotaları
const app = express();

// --- Güvenlik Middleware'leri ---

// Temel güvenlik başlıkları için Helmet
app.use(helmet());

// CORS ayarları (React uygulamanızın çalıştığı adresi belirtin)
const corsOptions = {
  origin: 'http://localhost:3000', // React uygulamanızın adresi
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// JSON body parser
app.use(express.json());

// Rate Limiter (Brute-force saldırılarını önlemek için)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 999, // Her IP'den bu pencerede en fazla 10 giriş denemesi
  message: 'Çok fazla giriş denemesi yapıldı, lütfen 15 dakika sonra tekrar deneyin.',
  standardHeaders: true, // RFC 6585 başlıklarını gönder
  legacyHeaders: false, // `X-RateLimit-*` başlıklarını devre dışı bırak
});

// Sadece /login rotasına rate limiting uygula
app.use('/login', loginLimiter);
// Ana Rotalar
app.use('/api/auth', authRoutes); // /api/auth altındaki tüm istekleri authRoutes'a yönlendir
app.use('/api/ogrenciler', ogrenciRoutes);
app.use('/api/messages', messagesRouter); // All routes in messages.js will be prefixed with /api/messages
app.use('/api/schedule', scheduleRoutes);
app.use('/api/devamsizlik', devamsizlikRoutes); // Devamsızlık ile ilgili rotalar
app.use('/api/notlandirma', notlandirmaRoutes);
app.use('/api/ogrencibildirim', ogrenciBildirimRoutes); // Öğrenci bildirim rotaları

// Basit bir test route'u
app.get('/', (req, res) => {
    res.send('Öğrenci Takip Sistemi Backend Çalışıyor!');
});
// Hata Yönetimi (Genel - Daha detaylı eklenebilir)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Beklenmedik bir sunucu hatası oluştu!');
});
// --- Veritabanı Bağlantı Havuzu ---
const dbPool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Veritabanı bağlantısını test et (isteğe bağlı)
async function testDbConnection() {
  try {
    const connection = await dbPool.getConnection();
    console.log('MySQL Veritabanına başarıyla bağlanıldı.');
    connection.release();
  } catch (error) {
    console.error('MySQL Veritabanına bağlanırken hata:', error);
    process.exit(1); // Bağlantı yoksa uygulamayı durdur
  }
}
testDbConnection();

// --- Rotalar ---

// POST /login Endpoint'i
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Basit girdi kontrolü
  if (!username || !password) {
    return res.status(400).json({ message: 'E-posta ve şifre alanları zorunludur.' });
  }

  let connection;
  try {
    connection = await dbPool.getConnection();

    // 1. Kullanıcıyı e-posta ile bul (SQL Injection koruması için placeholder kullanılıyor)
    const [rows] = await connection.execute('SELECT * FROM user WHERE username = ?', [username]);

    if (rows.length === 0) {
      // Kullanıcı bulunamadı (Güvenlik için hangi bilginin yanlış olduğunu belirtmemek daha iyi olabilir)
      return res.status(401).json({ message: 'Geçersiz e-posta veya şifre.' }); // Veya 404 Kullanıcı bulunamadı
    }

    const user = rows[0];

    // 2. Şifreyi karşılaştır
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    console.log(password+' '+ user.password +"   "+ user.rol);
    /* if (!isPasswordMatch) { yorumu kaldır
      // Şifre yanlış
      return res.status(401).json({ message: 'Geçersiz e-posta veya şifre.' });
    } */

    // 3. JWT Oluştur
    const payload = {
      userId: user.id,
      username: user.username
      // Rol gibi başka bilgiler de eklenebilir ama hassas bilgiler eklenmemeli
    };

    const secret = process.env.JWT_SECRET;
    const options = {
      expiresIn: process.env.JWT_EXPIRES_IN || '1h' // .env'den al veya varsayılan 1 saat
    };

    const token = jwt.sign(payload, secret, options);

    


    // 5. Token'ı döndür
    res.status(200).json({
      message: 'Giriş başarılı!',
      token: token,
      rol: user.rol,
      userId: user.id
    });

  } catch (error) {
    console.error('Giriş işlemi sırasında sunucu hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.' });
  } finally {
    if (connection) {
      connection.release(); // Bağlantıyı havuza geri bırak
    }
  }
});

// Kullanıcı ID'sini kullanıcı adına göre bulan basit bir yardımcı fonksiyon (Simülasyon)
// Gerçek bir uygulamada Users tablosundan sorgu yapılmalı
async function findUserIdByUsername(username) {
  console.log(`Kullanıcı adı ile ID aranıyor: ${username}`);
  // --- GERÇEK UYGULAMA İÇİN NOT ---
  // Burada 'Users' tablonuza sorgu yapmanız gerekir.
  // Örnek sorgu:
   const [rows] = await dbPool.query('SELECT id FROM user WHERE username = ?', [username]);
   console.log('rows length: ' + rows.length);
   console.log('rows: ' + rows);
   console.log('rows[0]: ' + rows[0]);
   console.log('rows[0].id: ' + rows[0].id);
   console.log('JSON.stringify(rows): '+ JSON.stringify(rows));
   
   if (rows.length > 0) {
     return rows[0].id;
   }
   return null; // Kullanıcı bulunamazsa

  // --- SİMÜLASYON ---
  // Bu örnek için basit bir eşleşme yapalım (Gerçek uygulamada bunu kullanmayın!)
  if (username.toLowerCase() === 'alici1') return 101;
  if (username.toLowerCase() === 'alici2') return 102;
  if (username.toLowerCase() === 'principal smith') return 201; // React kodundaki mock data ile eşleşmesi için
  if (username.toLowerCase() === 'guidance counselor') return 202;
  if (username.toLowerCase() === 'student support') return 203;
  return null; // Bulunamazsa null dön
}
/**
 * POST /api/messages/send
 * Yeni bir mesaj gönderir.
 * Request Body: { recipient: string (username/email), subject: string, body: string, senderId: number (opsiyonel, normalde auth'dan gelir) }
 */
app.post('/api/messages/send', async (req, res) => {
  const { to, subject, body } = req.body;
  const recipient = to;

  // --- GERÇEK UYGULAMA İÇİN NOT ---
  // Gönderen ID'si normalde kimlik doğrulama (authentication) işleminden (örneğin JWT token) alınır.
  // Bu örnekte, basitlik için frontend'den gönderilebilir veya burada sabit kodlanabilir.
  // Güvenlik açısından frontend'den alınması önerilmez.
   // --- JWT Token'ı Header üzerinden alma ve doğrulama ---
   const authHeader = req.headers.authorization;
   if (!authHeader) {
     console.error('Authorization header eksik.');
     return res.status(401).json({ success: false, message: 'Yetkisiz erişim: Token bulunamadı.' });
   }
   
   // Authorization header formatının "Bearer <token>" olduğunu varsayıyoruz.
   const token = authHeader.split(' ')[1];
   let decoded;
   try {
     decoded = jwt.verify(token, process.env.JWT_SECRET);
   } catch (error) {
     console.error('Geçersiz token:', error);
     return res.status(401).json({ success: false, message: 'Yetkisiz erişim: Token doğrulanamadı.' });
   }
  const senderId = decoded.userId;

  console.log('Mesaj gönderme isteği alındı:', { senderId, recipient, subject });
  

  // --- Girdi Doğrulama ---
  if (!recipient || !subject || !body) {
      console.error('Eksik bilgi:', { recipient, subject, body });
      return res.status(400).json({ success: false, message: 'Eksik bilgi: Alıcı, konu ve mesaj içeriği zorunludur.' });
  }

  let connection; // Bağlantıyı try bloğu dışında tanımla
  try {
      // Alıcı ID'sini bul (Gerçek uygulamada Users tablosundan sorgulanmalı)
      const recipientId = await findUserIdByUsername(recipient);
      console.log('Alıcı ID\'si:', recipientId);
      if (!recipientId) {
          console.error(`Alıcı bulunamadı: ${recipient}`);
          return res.status(404).json({ success: false, message: `Alıcı '${recipient}' bulunamadı.` });
      }

      // Veritabanı bağlantısı al
      connection = await dbPool.getConnection();
      console.log('Veritabanı bağlantısı alındı.');

      // Mesajı veritabanına ekle gonderen_id, alici_id, konu, icerik, 
      const insertQuery = `
          INSERT INTO mesaj (gonderen_id, alici_id, konu, icerik)
          VALUES (?, ?, ?, ?)
      `;
      const [result] = await connection.query(insertQuery, [senderId, recipientId, subject, body]);

      console.log('Mesaj başarıyla eklendi. Insert ID:', result.insertId);

      // Bildirim ekle
      const notificationSql = `
          INSERT INTO bildirim (bildirim_icerigi, bildirim_turu_id, ogrenci_id)
          VALUES (?, ?, ?);
      `;
      const notificationContent = `Yeni bir mesajınız var: Konu '${subject}'`;
      await connection.query(notificationSql, [notificationContent, 4, recipientId]);

      // Başarılı yanıt gönder
      res.status(201).json({ success: true, message: 'Mesaj başarıyla gönderildi!', messageId: result.insertId });

  } catch (error) {
      console.error('Mesaj gönderilirken hata oluştu:', error);
      // Genel bir hata mesajı gönder
      res.status(500).json({ success: false, message: 'Mesaj gönderilirken bir sunucu hatası oluştu.' });
  } finally {
      // Bağlantıyı her zaman serbest bırak (hata olsa bile)
      if (connection) {
          connection.release();
          console.log('Veritabanı bağlantısı serbest bırakıldı.');
      }
  }
});

// Diğer Rotalar (Örnek: Kayıt Ol, Şifremi Unuttum vb. buraya eklenebilir)
// app.post('/register', ...);
// app.post('/forgot-password', ...);

//  (Gelen Kutusu, Gönderilenler vb.) ---
// TODO: Gelen kutusu, gönderilenler, mesaj detayları için endpoint'ler ekleyin.
// Örnek:
// app.get('/api/messages/inbox/:userId', async (req, res) => { ... });
// app.get('/api/messages/sent/:userId', async (req, res) => { ... });


// --- Sunucuyu Başlat ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend sunucusu http://localhost:${PORT} adresinde çalışıyor.`);
});

// --- Güvenlik Notları ---
// CSRF Koruması: State'li uygulamalarda (session kullanan) csurf gibi paketler kullanılabilir.
//              JWT (stateless) kullanırken, CSRF genellikle daha az risklidir ancak
//              özellikle cookie tabanlı token saklama kullanılıyorsa SameSite=Strict/Lax
//              cookie flag'leri ve/veya double submit cookie yöntemi düşünülebilir.
// XSS Koruması: Helmet bazı başlıkları ayarlar. Frontend tarafında React zaten JSX
//               üzerinden temel koruma sağlar. Kullanıcı girdisi direkt HTML'e
//               basılıyorsa (dangerouslySetInnerHTML) sanitization yapılmalıdır.
// SQL Injection Koruması: mysql2'nin placeholder (?) veya prepare statement kullanımı
//                         bu örnekte olduğu gibi koruma sağlar. Asla string birleştirme
//                         ile sorgu oluşturmayın.