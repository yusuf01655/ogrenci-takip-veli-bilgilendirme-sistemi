/* GirisEkrani.jsx */
import React, { useState, useEffect } from 'react';
import {Link as RouterLink} from 'react-router-dom';

import axios from 'axios';
import {
    Container,
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Link,
    Checkbox,
    FormControlLabel,
    IconButton,
    InputAdornment,
    Grid,
    ThemeProvider,
    createTheme,
    CssBaseline
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import './style/GirisEkrani.css'; // Import the CSS file
import { useNavigate, BrowserRouter, Router, Routes, Route, Navigate } from 'react-router-dom';
const theme = createTheme({
    palette: {
        primary: {
            main: '#007BFF', // Blue
        },
        secondary: {
            main: '#28A745', // Green
        },
        background: {
            default: '#F8F9FA', // Light Gray
        },
        error: {
            main: '#FFA500', // Orange for accents/errors (can be adjusted)
        },
        text: {
            primary: '#212529', // Dark gray for text
            secondary: '#6c757d', // Medium gray for secondary text
        },
    },
    typography: {
        fontFamily: 'Roboto, Arial, sans-serif', // Roboto font
        h5: {
            fontWeight: 600, // Make titles a bit bolder
        },
        button: {
            textTransform: 'none', // Keep button text case as is
            fontWeight: 600,
        },
    },
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: '12px', // Rounded corners for cards
                    boxShadow: '0 4px 12px rgba(0, 123, 255, 0.1)', // Subtle shadow
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '8px', // Rounded corners for buttons
                    padding: '10px 20px', // Comfortable padding
                },
                containedPrimary: {
                    '&:hover': {
                        backgroundColor: '#0056b3', // Darker blue on hover
                    },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '8px', // Rounded corners for text fields
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#007BFF', // Blue border on hover
                        },
                    },
                },
            },
        },
        MuiLink: {
            styleOverrides: {
                root: {
                    color: '#007BFF', // Blue links
                    textDecoration: 'none',
                    '&:hover': {
                        textDecoration: 'underline',
                    },
                },
            },
        },
    },
  });

  const GirisEkrani =   ({ onLogin }) =>{
     // State hooks for form fields and password visibility
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(''); // State for login errors

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Yönlendirme fonksiyonunu al
  
    const handleSignUp = () => {
        navigate('/register');
    }
  // Handler for login button click
  const handleLogin = async (event) => {
      event.preventDefault(); // Prevent default form submission
      setError(''); // Clear previous errors

      // --- Basic Validation ---
      if (!username || !password) {
          setError('Kullanıcı adı ve şifre boş bırakılamaz.');
          return;
      }
        // 2. E-posta Formatı Kontrolü
   
  
      // 3. Şifre Minimum Uzunluk Kontrolü
      if (password.length < 6) {
        setError('Şifre en az 6 karakter uzunluğunda olmalıdır.');
        return;
      }
      setLoading(true); // Yükleniyor durumunu başlat


      // --- Mock Login Logic ---
      // In a real application, you would send username and password
      // to your backend API for verification here.
      console.log('Giriş denemesi:', { username, password, rememberMe });
      try{
         // Backend API'sine istek gönder
      const response = await axios.post('http://localhost:5000/login', { // Backend adresiniz
        username: username,
        password: password,
        });
        // Başarılı Giriş
      if (response.status === 200 && response.data.token) {
        console.log('Giriş Başarılı:', response.data.message);

        // JWT Token'ı Kaydetme (localStorage veya sessionStorage)
        // localStorage: Tarayıcı kapatılsa bile kalır.
        // sessionStorage: Sekme/tarayıcı kapatılınca silinir.
        localStorage.setItem('authToken', response.data.token);
        // veya: sessionStorage.setItem('authToken', response.data.token);
        const userRole = response.data.rol;
        console.log('backendden gelen Kullanıcı Rolü:', userRole);
        onLogin(userRole, response.data.token); // userType parametresi önemli
        // Kullanıcıyı Ana Sayfaya Yönlendir
        navigate('/dashboard'); // Veya hedef sayfanız neyse ('/home', '/profile' vb.)

      } else {
         // Beklenmedik başarılı durum (token yoksa vb.)
         setError(response.data.message || 'Giriş sırasında bir hata oluştu.');
      }
      }catch(err){
 // Hata Yönetimi
      if (err.response) {
        // Backend'den gelen hata (örn: 401, 400, 500)
        console.error("API Hatası:", err.response.data);
        setError(err.response.data.message || 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
      } else if (err.request) {
        // İstek yapıldı ama cevap alınamadı (örn: sunucu kapalı)
        console.error("Ağ Hatası:", err.request);
        setError('Sunucuya ulaşılamıyor. Lütfen internet bağlantınızı kontrol edin veya daha sonra tekrar deneyin.');
      } else {
        // İsteği ayarlarken bir hata oluştu
        console.error('İstek Ayarlama Hatası:', err.message);
        setError('Bir hata oluştu. Lütfen tekrar deneyin.');
      }
    } finally {
      setLoading(false); // Yükleniyor durumunu bitir
    }
      
  };

  // Toggle password visibility
  const handleClickShowPassword = () => {
      setShowPassword(!showPassword);
  };

  // Prevent default mouse down behavior on the icon button
  const handleMouseDownPassword = (event) => {
      event.preventDefault();
  };
    return(<>
    
    <Container
          maxWidth={false} // Disable fixed max width
          sx={{
              display: 'flex',
              alignItems: 'center', // Center vertically
              justifyContent: 'center', // Center horizontally
              minHeight: '100vh', // Full viewport height
              px: { xs: 2, sm: 3 }, // Horizontal padding responsive
              backgroundColor: 'background.default', // Use theme background
          }}
          className="fade-in" // Apply fade-in animation on load
      >
          <Grid container spacing={0} sx={{ maxWidth: '900px', width: '100%' }}> {/* Max width for the content */}

              {/* Left Side: Logo/Info (Visible on md and up) */}
              <Grid
                  item
                  xs={12} // Full width on extra-small screens (hidden, effectively)
                  md={5}  // Takes 5 columns on medium screens and up
                  sx={{
                      display: { xs: 'none', md: 'flex' }, // Hide on xs, flex on md+
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'primary.main', // Blue background
                      color: 'white',
                      p: 4, // Padding
                      borderTopLeftRadius: { md: '12px' }, // Match card radius
                      borderBottomLeftRadius: { md: '12px' },
                  }}
              >
                   {/* Placeholder for Logo */}
                   <Box sx={{ mb: 3, width: 80, height: 80, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '50%', display:'flex', alignItems:'center', justifyContent:'center' }}>
                       <Typography variant="h4" component="span" sx={{fontWeight: 'bold'}}> L </Typography> {/* Example Initial */}
                   </Box>
                  <Typography variant="h5" component="h1" gutterBottom align="center">
                      Öğrenci Takip Sistemi
                  </Typography>
                  <Typography variant="body1" align="center">
                      Veli Bilgilendirme Platformu
                  </Typography>
                   {/* You can add more descriptive text or images here */}
              </Grid>

              {/* Right Side: Login Form */}
              <Grid item xs={12} md={7}> {/* Takes full width on xs, 7 columns on md+ */}
                  <Card
                      sx={{
                          width: '100%',
                          borderTopLeftRadius: { xs: '12px', md: 0 }, // Adjust radius for responsiveness
                          borderBottomLeftRadius: { xs: '12px', md: 0 },
                          borderTopRightRadius: '12px',
                          borderBottomRightRadius: '12px',
                          boxShadow: { xs: '0 4px 12px rgba(0, 123, 255, 0.1)', md: 'none' }, // Shadow only on mobile where card is standalone
                      }}
                  >
                      <CardContent sx={{ p: { xs: 3, sm: 4 } }}> {/* Responsive padding */}
                          {/* Logo/Title for Mobile */}
                          <Box sx={{ display: { xs: 'block', md: 'none' }, textAlign: 'center', mb: 3 }}>
                              <Typography variant="h5" component="h1" gutterBottom>
                                  Sisteme Giriş Yap
                              </Typography>
                               {/* You might want a smaller logo here for mobile */}
                          </Box>

                           {/* Title for Desktop */}
                           <Typography variant="h5" component="h1" gutterBottom sx={{ display: { xs: 'none', md: 'block' }, mb: 3 }}>
                              Sisteme Giriş Yap
                          </Typography>

                          {/* Login Form */}
                          <Box component="form" onSubmit={handleLogin} noValidate>
                              {/* Error Message Display */}
                              {error && (
                                  <Typography color="error" variant="body2" sx={{ mb: 2, textAlign: 'center' }} className="fade-in-error">
                                      {error}
                                  </Typography>
                              )}

                              {/* Username Field */}
                              <TextField
                                  margin="normal"
                                  required
                                  fullWidth
                                  id="username"
                                  label="Kullanıcı Adı / E-posta / TCKN"
                                  name="username"
                                  autoComplete="username"
                                  autoFocus // Focus on this field first
                                  value={username}
                                  onChange={(e) => setUsername(e.target.value)}
                                  variant="outlined" // Use outlined style
                              />

                              {/* Password Field */}
                              <TextField
                                  margin="normal"
                                  required
                                  fullWidth
                                  name="password"
                                  label="Şifre"
                                  type={showPassword ? 'text' : 'password'}
                                  id="password"
                                  autoComplete="current-password"
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                  variant="outlined" // Use outlined style
                                  InputProps={{ // Add visibility toggle icon
                                      endAdornment: (
                                          <InputAdornment position="end">
                                              <IconButton
                                                  aria-label="toggle password visibility"
                                                  onClick={handleClickShowPassword}
                                                  onMouseDown={handleMouseDownPassword}
                                                  edge="end"
                                                  className="password-toggle-icon" // Add class for potential styling
                                              >
                                                  {showPassword ? <VisibilityOff /> : <Visibility />}
                                              </IconButton>
                                          </InputAdornment>
                                      ),
                                  }}
                              />

                              {/* Remember Me & Forgot Password Row */}
                              <Box
                                  sx={{
                                      display: 'flex',
                                      justifyContent: 'space-between', // Space between items
                                      alignItems: 'center', // Align vertically
                                      mt: 1, // Margin top
                                      mb: 2, // Margin bottom
                                      flexWrap: 'wrap', // Wrap on smaller screens if needed
                                  }}
                              >
                                  <FormControlLabel
                                      control={
                                          <Checkbox
                                              value="remember"
                                              color="primary"
                                              checked={rememberMe}
                                              onChange={(e) => setRememberMe(e.target.checked)}
                                          />
                                      }
                                      label="Beni Hatırla"
                                      sx={{ mr: 'auto' }} // Push forgot password link to the right
                                  />
                                  <Link href="#" variant="body2" className="forgot-password-link">
                                      Şifremi Unuttum?
                                  </Link>
                              </Box>

                              {/* Login Button */}
                              <Button
                                  type="submit"
                                  fullWidth
                                  variant="contained"
                                  color="primary" // Use primary color (Blue)
                                  sx={{ mt: 2, mb: 2, py: 1.5 }} // Vertical padding for button height
                                  className="login-button" // Add class for custom hover effects
                              >
                                  Giriş Yap
                              </Button>

                              {/* Optional: Link to Sign up */}
                              <Box sx={{ textAlign: 'center', mt: 2 }}>
                                  <Link  component= {RouterLink} to ="/register"  variant="body2" color="text.secondary">
                                       Kaydolmak  için Tıklayın
                                  </Link>
                              </Box>

                              {/* Optional: Footer Info */}
                              <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 4 }}>
                                  {'© '}
                                  {new Date().getFullYear()}
                                  {' Öğrenci Takip Sistemi. Tüm Hakları Saklıdır.'}
                              </Typography>
                          </Box>
                      </CardContent>
                  </Card>
              </Grid>
          </Grid>
      </Container></>);
  }
  export default GirisEkrani;