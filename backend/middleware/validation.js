// server/middleware/validation.js
const { body, validationResult } = require('express-validator');

const registerValidationRules = () => {
  return [
    body('username').notEmpty().withMessage('Kullanıcı adı boş olamaz.')
        .isLength({ min: 3 }).withMessage('Kullanıcı adı en az 3 karakter olmalıdır.'),
    body('password').isLength({ min: 6 }).withMessage('Şifre en az 6 karakter olmalıdır.'),
    body('rol').isIn(['ogrenci', 'veli', 'yonetici', 'ogretmen']).withMessage('Geçersiz rol seçimi.') // Rolleri buraya ekleyin
  ];
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map(err => extractedErrors.push({ [err.param]: err.msg })); // Daha basit hata formatı

  // İlk hatayı gönderelim (frontend'de tek mesaj göstermek daha kolay olabilir)
  return res.status(400).json({
    message: errors.array()[0].msg, // İlk hatanın mesajı
    // errors: extractedErrors, // Tüm hataları göndermek isterseniz
  });
};

module.exports = {
  registerValidationRules,
  validate,
};