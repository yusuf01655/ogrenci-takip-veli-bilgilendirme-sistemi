import logo from './logo.svg';
import './App.css';
import DersProgrami from './component/DersProgrami';
import Anasayfa from './component/Anasayfa';
import VeliAnasayfa from './component/VeliAnasayfa';
import YonetimAnasayfa from './component/YonetimAnasayfa';
import React, { useState, useEffect } from 'react';
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
import './component/style/GirisEkrani.css'; // Import the CSS file
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

/* function GirisEkrani({ onLogin }) {
    // Basit bir giriş butonu simülasyonu
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Giriş Ekranı</h1>
        <p>Lütfen giriş yapınız.</p>
        <button onClick={() => onLogin('ogrenci')}>Öğrenci Girişi</button>
        <button onClick={() => onLogin('veli')}>Veli Girişi</button>
        <button onClick={() => onLogin('yonetim')}>Yönetim Girişi</button>
       
      </div>
    );
  } */
  
  /* function Anasayfa({ userType }) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>Öğrenci Anasayfa</h1>
        <p>Hoş geldiniz! Kullanıcı Tipi: {userType}</p>
       
      </div>
    );
  } */
  
  /* function DersProgrami({ userType }) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>Ders Programı</h1>
        <p>Kullanıcı Tipi: {userType}</p>
        
      </div>
    );
  } */
  
  /* function VeliAnasayfa({ userType }) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>Veli Anasayfa</h1>
        <p>Hoş geldiniz! Kullanıcı Tipi: {userType}</p>
       
      </div>
    );
  } */
  
  /* function YonetimAnasayfa({ userType }) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>Yönetim Anasayfa</h1>
        <p>Hoş geldiniz! Kullanıcı Tipi: {userType}</p>
        
      </div>
    );
  } */
  // --- Örnek Sayfa Bileşenleri Sonu ---
// Define the color palette
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
function App() {
    // Kullanıcının giriş yapıp yapmadığını ve tipini tutacak state'ler
  // Gerçek uygulamada bu bilgiyi localStorage, context API veya state management kütüphanesi (Redux, Zustand) ile yönetmek daha iyidir.
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState('ogrenci'); // 'ogrenci', 'veli', 'yonetim'

  // Giriş işlemi (GirisEkrani'ndan çağrılacak)
  const handleLogin = (type) => {
    setIsLoggedIn(true);
    setUserType(type);
    // Gerçek uygulamada burada API çağrısı, token kaydetme vb. işlemler yapılır.
    console.log(type + ' olarak giriş yapıldı.');
  };

  // Çıkış işlemi (Bir 'Çıkış Yap' butonu ile çağrılabilir)
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserType(null);
    // Token silme vb. işlemler
    console.log('Çıkış yapıldı.');
  };

  // --- Yönlendirme Mantığı ---
  // Giriş yapılmamışsa her zaman giriş ekranına yönlendir
  if (!isLoggedIn) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
         {/* BrowserRouter'ı burada da kullanabilirsiniz veya sadece giriş ekranını gösterebilirsiniz */}
         <BrowserRouter>
            <Routes>
              <Route path="*" element={<GirisEkrani onLogin={handleLogin} />} />
              {/* Eğer giriş ekranı dışında başka public sayfalar varsa buraya ekleyebilirsiniz */}
              {/* <Route path="/hakkimizda" element={<Hakkimizda />} /> */}
            </Routes>
         </BrowserRouter>
      </ThemeProvider>
    );
  }

  // --- Giriş Yapılmışsa Kullanıcı Tipine Göre Yönlendirme ---
  // Kullanıcı tipine göre hangi anasayfanın gösterileceğini belirle
  let HomePageComponent;
  switch (userType) {
    case 'veli':
      HomePageComponent = VeliAnasayfa;
      break;
    case 'yonetim':
      HomePageComponent = YonetimAnasayfa;
      break;
    case 'ogrenci':
    default: // Varsayılan olarak öğrenci anasayfası
      HomePageComponent = Anasayfa;
      break;
  }


  return (
    <div className='App'>
    asdas
    <ThemeProvider theme={theme}>
    <CssBaseline /> {/* Apply baseline styles and background color */}
    {/* BrowserRouter yönlendirmeyi etkinleştirir */}
    <BrowserRouter>
        {/* Üst kısımda sabit kalacak bir menü veya başlık ekleyiniz. */}
        <header style={{ background: '#eee', padding: '10px', marginBottom: '10px' }}>
          <nav>
            {/* Link bileşenleri ile sayfa geçişleri (örnek) */}
            {/* Bu linkler kullanıcı tipine göre dinamik olarak gösterilebilir */}
            {userType === 'ogrenci' && <a href="/">Anasayfa</a>} | {' '}
            {userType === 'ogrenci' && <a href="/ders-programi">Ders Programı</a>}
            {userType === 'veli' && <a href="/">Veli Anasayfa</a>}
            {userType === 'yonetim' && <a href="/">Yönetim Anasayfa</a>}
             | <button onClick={handleLogout}>Çıkış Yap</button>
             {/* talep:  <Link to="/">Anasayfa</Link> gibi react-router-dom'un Link bileşenini kullanacak şekilde güncelleyiniz*/}
          </nav>
        </header>

        
        <Routes>
          {/* Ana Sayfa Yönlendirmesi (Kullanıcı tipine göre değişir) */}
          <Route path="/" element={<HomePageComponent userType={userType} />} />

          {/* Diğer Sayfalar (Örnek: Sadece öğrenci görebilsin) */}
          {userType === 'ogrenci' && (
            <Route path="/ders-programi" element={<DersProgrami userType={userType} />} />
          )}

          {/* Yetkisiz Erişim veya Tanımsız Rotalar için Yönlendirme yapınız */}
          {/* Örneğin, veli ders programına girmeye çalışırsa anasayfaya yönlendir */}
          {userType !== 'ogrenci' && (
             <Route path="/ders-programi" element={<Navigate to="/" replace />} />
          )}

          {/* Diğer kullanıcı tipleri için özel sayfaları  buraya ekleyiniz */}
          {/* <Route path="/veli/bildirimler" element={userType === 'veli' ? <VeliBildirimler /> : <Navigate to="/" />} /> */}
          {/* <Route path="/yonetim/kullanicilar" element={userType === 'yonetim' ? <YonetimKullanicilar /> : <Navigate to="/" />} /> */}


          {/* Eşleşmeyen tüm yollar için ana sayfaya yönlendirme veya 404 sayfası */}
          <Route path="*" element={<Navigate to="/" replace />} />
          {/* Veya bir 404 Not Found bileşeni gösterebilirsiniz: */}
          {/* <Route path="*" element={<NotFoundPage />} /> */}

        </Routes>
      </BrowserRouter>
   {/*  <Anasayfa/>
    <DersProgrami/>
    <VeliAnasayfa/>
    <GirisEkrani />
    <YonetimAnasayfa/> */}
    </ThemeProvider>
    </div>);
}
// Login Screen Component
function GirisEkrani() {
  // State hooks for form fields and password visibility
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(''); // State for login errors

  // Handler for login button click
  const handleLogin = (event) => {
      event.preventDefault(); // Prevent default form submission
      setError(''); // Clear previous errors

      // --- Basic Validation ---
      if (!username || !password) {
          setError('Kullanıcı adı ve şifre boş bırakılamaz.');
          return;
      }

      // --- Mock Login Logic ---
      // In a real application, you would send username and password
      // to your backend API for verification here.
      console.log('Giriş denemesi:', { username, password, rememberMe });

      // Example: Simulate successful login for "admin" / "password"
      if (username === 'admin' && password === 'password') {
          console.log('Giriş başarılı!');
          // Redirect to the appropriate dashboard based on user role
          // window.location.href = '/dashboard'; // Example redirection
      } else {
          // Simulate failed login
          console.log('Giriş başarısız!');
          setError('Kullanıcı adı veya şifre hatalı.');
          setPassword(''); // Clear password field on error for security
      }
      // --- End Mock Login Logic ---
  };

  // Toggle password visibility
  const handleClickShowPassword = () => {
      setShowPassword(!showPassword);
  };

  // Prevent default mouse down behavior on the icon button
  const handleMouseDownPassword = (event) => {
      event.preventDefault();
  };

  return (
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

                              {/* Optional: Link to Help/Support */}
                              <Box sx={{ textAlign: 'center', mt: 2 }}>
                                  <Link href="#" variant="body2" color="text.secondary">
                                      Yardım veya Destek için Tıklayın
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
      </Container>
  );
}

export default App;
