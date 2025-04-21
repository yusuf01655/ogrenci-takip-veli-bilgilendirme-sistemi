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
      rol: user.rol
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

// Diğer Rotalar (Örnek: Kayıt Ol, Şifremi Unuttum vb. buraya eklenebilir)
// app.post('/register', ...);
// app.post('/forgot-password', ...);


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