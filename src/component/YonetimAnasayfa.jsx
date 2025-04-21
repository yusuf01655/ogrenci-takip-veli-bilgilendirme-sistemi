import React, { useState } from 'react';
import {
    AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItem, ListItemIcon,
    ListItemText, CssBaseline, Box, Container, Grid, Paper, Avatar, Badge, Menu, MenuItem, Tooltip, createTheme, ThemeProvider
  } from '@mui/material';
  import MenuIcon from '@mui/icons-material/Menu';
  import NotificationsIcon from '@mui/icons-material/Notifications';
  import MessageIcon from '@mui/icons-material/Message';
  import SettingsIcon from '@mui/icons-material/Settings';
  import ExitToAppIcon from '@mui/icons-material/ExitToApp';
  import DashboardIcon from '@mui/icons-material/Dashboard';
  import PeopleIcon from '@mui/icons-material/People'; // Öğrenci Yönetimi
  import SchoolIcon from '@mui/icons-material/School'; // Öğretmen Yönetimi
  import ContactMailIcon from '@mui/icons-material/ContactMail'; // Veli İletişimi
  import AssessmentIcon from '@mui/icons-material/Assessment'; // Raporlar
  import EventIcon from '@mui/icons-material/Event'; // Etkinlikler
  import AnnouncementIcon from '@mui/icons-material/Announcement'; // Duyurular
  import WarningIcon from '@mui/icons-material/Warning'; // Uyarılar
  import BarChartIcon from '@mui/icons-material/BarChart'; // İstatistikler için
  import './style/YoneticiAnasayfa.css'; // Özel stiller için

// Kurumsal Renk Paleti ve Tipografi ile Tema Oluşturma
const theme = createTheme({
    palette: {
      primary: {
        main: '#007BFF', // Ana Renk: Mavi
      },
      secondary: {
        main: '#28A745', // Tamamlayıcı Renk: Yeşil
      },
      background: {
        default: '#F8F9FA', // Arka Plan Rengi: Açık Gri
      },
      error: {
        main: '#FFA500', // Vurgu Rengi: Turuncu (Uyarılar için kullanılabilir)
      },
      text: {
        primary: '#212529',
        secondary: '#6c757d',
      },
    },
    typography: {
      fontFamily: 'Roboto, sans-serif', // Tipografi: Roboto
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: '12px', // Köşeleri yuvarlak kartlar ve paneller
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '8px', // Köşeleri yuvarlak butonlar
            textTransform: 'none', // Buton metinleri normal kalsın
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            borderRight: 'none', // Kenarlığı kaldır
          }
        }
      },
       MuiListItem: { // Hover efekti için
          styleOverrides: {
              root: {
                  '&:hover': {
                      backgroundColor: 'rgba(0, 123, 255, 0.08)', // Hafif mavi arka plan
                      transition: 'background-color 0.3s ease', // Geçiş efekti
                  },
              },
          },
       },
    },
  });
  const drawerWidth = 240; // Sol menü genişliği
const YonetimAnasayfa = () => {
    const [mobileOpen, setMobileOpen] = useState(false); // Mobil menü durumu
  const [selectedContent, setSelectedContent] = useState('genelBakis'); // Gösterilecek içerik
  const [anchorEl, setAnchorEl] = useState(null); // Kullanıcı menüsü için
  const userMenuOpen = Boolean(anchorEl);

  // Mobil menüyü aç/kapat
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Kullanıcı menüsünü aç
  const handleUserMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Kullanıcı menüsünü kapat
  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };
  const handleUserMenuCloseCikisYap = () => {
    setAnchorEl(null);
// JWT'yi temizle
localStorage.removeItem('authToken'); // ya da sessionStorage
  
// Giriş sayfasına yönlendir
window.location.href = '/login';
  };

  // İçerik değiştirme
  const handleMenuClick = (contentKey) => {
    setSelectedContent(contentKey);
    if (mobileOpen) { // Mobil menü açıksa kapat
        setMobileOpen(false);
    }
  };

  // Sol Menü Öğeleri
  const menuItems = [
    { text: 'Genel Bakış', icon: <DashboardIcon />, key: 'genelBakis' },
    { text: 'Öğrenci Yönetimi', icon: <PeopleIcon />, key: 'ogrenciYonetimi' },
    { text: 'Öğretmen Yönetimi', icon: <SchoolIcon />, key: 'ogretmenYonetimi' },
    { text: 'Veli İletişimi', icon: <ContactMailIcon />, key: 'veliIletisimi' },
    { text: 'Raporlar ve Analiz', icon: <AssessmentIcon />, key: 'raporlar' },
    { text: 'Sistem Ayarları', icon: <SettingsIcon />, key: 'ayarlar' },
  ];

  // Sol Menü İçeriği
  const drawer = (
    <div className="drawer-container">
      <Toolbar sx={{ justifyContent: 'center', py: 2 }}>
         {/* Buraya okul logosu eklenebilir */}
         <Typography variant="h6" noWrap component="div" color="primary">
           Okul Yönetim
         </Typography>
      </Toolbar>
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.key}
            onClick={() => handleMenuClick(item.key)}
            selected={selectedContent === item.key} // Seçili öğeyi vurgula
            className="menu-item"
          >
            <ListItemIcon sx={{ color: selectedContent === item.key ? 'primary.main' : 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  // Ana İçerik Alanı
  const renderContent = () => {
    switch (selectedContent) {
      case 'ogrenciYonetimi':
        return <Typography variant="h5" gutterBottom>Öğrenci Yönetimi Alanı</Typography>;
      case 'ogretmenYonetimi':
        return <Typography variant="h5" gutterBottom>Öğretmen Yönetimi Alanı</Typography>;
      case 'veliIletisimi':
        return <Typography variant="h5" gutterBottom>Veli İletişimi Alanı</Typography>;
      case 'raporlar':
        return <Typography variant="h5" gutterBottom>Raporlar ve Analiz Alanı</Typography>;
      case 'ayarlar':
        return <Typography variant="h5" gutterBottom>Sistem Ayarları Alanı</Typography>;
      case 'genelBakis':
      default:
        return (
          <Box>
            <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>Genel Bakış</Typography>
            {/* İstatistik Kartları - Mobil: Alt alta, Masaüstü: Yan yana */}
            <Grid container spacing={3} className="stats-grid">
              <Grid item xs={12} sm={6} md={3}>
                <Paper elevation={2} className="stat-card stat-card-blue">
                  <PeopleIcon fontSize="large" />
                  <Typography variant="h6">1250</Typography>
                  <Typography variant="body2">Toplam Öğrenci</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper elevation={2} className="stat-card stat-card-green">
                  <SchoolIcon fontSize="large" />
                  <Typography variant="h6">85</Typography>
                  <Typography variant="body2">Toplam Öğretmen</Typography>
                </Paper>
              </Grid>
               <Grid item xs={12} sm={6} md={3}>
                <Paper elevation={2} className="stat-card stat-card-orange">
                  <WarningIcon fontSize="large" />
                  <Typography variant="h6">15</Typography>
                  <Typography variant="body2">Bugünkü Devamsızlık</Typography>
                </Paper>
              </Grid>
               <Grid item xs={12} sm={6} md={3}>
                <Paper elevation={2} className="stat-card stat-card-purple">
                  <ContactMailIcon fontSize="large" />
                  <Typography variant="h6">2100</Typography>
                  <Typography variant="body2">Toplam Veli</Typography>
                </Paper>
              </Grid>
            </Grid>

            {/* Diğer Bölümler (Duyurular, Etkinlikler, Hızlı Erişim vb.) */}
            <Grid container spacing={3} sx={{ mt: 2 }}>
              {/* Yaklaşan Etkinlikler */}
              <Grid item xs={12} md={6}>
                <Paper elevation={1} sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <EventIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6">Yaklaşan Etkinlikler</Typography>
                  </Box>
                  <List dense>
                    <ListItem>
                      <ListItemText primary="Veli Toplantısı" secondary="15 Nisan 2025 - 18:00" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Bilim Fuarı" secondary="22 Nisan 2025 - Tüm Gün" />
                    </ListItem>
                     <ListItem>
                      <ListItemText primary="Mezuniyet Töreni Provası" secondary="30 Nisan 2025 - 14:00" />
                    </ListItem>
                  </List>
                </Paper>
              </Grid>

              {/* Son Duyurular */}
              <Grid item xs={12} md={6}>
                 <Paper elevation={1} sx={{ p: 2 }}>
                   <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                     <AnnouncementIcon sx={{ mr: 1, color: 'secondary.main' }} />
                     <Typography variant="h6">Son Duyurular</Typography>
                   </Box>
                   <List dense>
                    <ListItem>
                      <ListItemText primary="23 Nisan Tören Programı Yayınlandı" secondary="5 Nisan 2025" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Kantin Fiyatları Güncellendi" secondary="4 Nisan 2025" />
                    </ListItem>
                     <ListItem>
                      <ListItemText primary="Yeni Servis Güzergahları" secondary="1 Nisan 2025" />
                    </ListItem>
                  </List>
                 </Paper>
              </Grid>

               {/* Önemli Uyarılar */}
              <Grid item xs={12}>
                 <Paper elevation={1} sx={{ p: 2, borderColor: 'error.main', borderWidth: 1, borderStyle: 'solid' }} className="fade-in">
                   <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                     <WarningIcon sx={{ mr: 1, color: 'error.main' }} />
                     <Typography variant="h6" sx={{color: 'error.main'}}>Önemli Uyarılar</Typography>
                   </Box>
                   <Typography variant="body2">- 11-B Sınıfında artan devamsızlık oranları.</Typography>
                   <Typography variant="body2">- Matematik dersi not ortalaması genel düşüşte.</Typography>
                 </Paper>
              </Grid>

               {/* Basit Grafik Alanı (Placeholder) */}
               <Grid item xs={12}>
                 <Paper elevation={1} sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                     <BarChartIcon sx={{ mr: 1, color: 'primary.main' }} />
                     <Typography variant="h6">Genel Başarı Durumu (Örnek)</Typography>
                   </Box>
                   {/* Buraya bir grafik kütüphanesi (örn: Recharts) entegre edilebilir */}
                   <Box sx={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#e9ecef', borderRadius: 1 }}>
                       <Typography color="textSecondary">Grafik Alanı</Typography>
                   </Box>
                 </Paper>
               </Grid>
            </Grid>
          </Box>
        );
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline /> {/* Tarayıcı varsayılan stillerini sıfırlar */}

        {/* Üst Bar */}
        <AppBar
          position="fixed"
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 1, // Menünün üzerinde kalması için
            backgroundColor: 'white', // Beyaz AppBar
            color: 'text.primary', // Metin rengi
            boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.1)', // Hafif gölge
          }}
          className="app-bar-transition" // CSS'ten animasyon sınıfı
        >
          <Toolbar>
            {/* Mobil Menü Butonu */}
            <IconButton
              color="inherit"
              aria-label="menüyü aç"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: 'none' } }} // Sadece mobilde göster
            >
              <MenuIcon />
            </IconButton>

            {/* Başlık (Opsiyonel, logo yerine veya ek olarak) */}
             <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}>
              Yönetici Paneli
            </Typography>

            <Box sx={{ flexGrow: 1 }} /> {/* Sağdaki ikonları sağa iter */}

            {/* Sağ Üst İkonlar */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
               <Tooltip title="Mesajlar">
                 <IconButton color="inherit" sx={{ mr: 1 }} className="icon-button-hover">
                   <Badge badgeContent={4} color="secondary"> {/* Örnek bildirim sayısı */}
                     <MessageIcon />
                   </Badge>
                 </IconButton>
               </Tooltip>
              <Tooltip title="Bildirimler">
                <IconButton color="inherit" sx={{ mr: 1 }} className="icon-button-hover">
                  <Badge badgeContent={17} color="error"> {/* Örnek bildirim sayısı */}
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
               <Tooltip title="Ayarlar">
                 <IconButton color="inherit" sx={{ mr: 1 }} className="icon-button-hover" onClick={() => handleMenuClick('ayarlar')}>
                    <SettingsIcon />
                 </IconButton>
               </Tooltip>

              {/* Kullanıcı Profili ve Menüsü */}
              <Tooltip title="Kullanıcı Profili">
                <IconButton onClick={handleUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="Yönetici Adı" src="/static/images/avatar/2.jpg" /> {/* Placeholder avatar */}
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={userMenuOpen}
                onClose={handleUserMenuClose}
                className="fade-in" // CSS'ten animasyon sınıfı
              >
                <MenuItem onClick={handleUserMenuClose}>Profil</MenuItem>
                <MenuItem onClick={handleUserMenuClose}>Hesap Ayarları</MenuItem>
                <MenuItem onClick={handleUserMenuCloseCikisYap}>
                   <ListItemIcon>
                      <ExitToAppIcon fontSize="small" />
                   </ListItemIcon>
                   Çıkış Yap
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Sol Menü (Drawer) */}
        <Box
          component="nav"
          sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
          aria-label="ana menü"
        >
          {/* Mobil için Geçici Menü */}
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Performans için mobil cihazlarda daha iyi.
            }}
            sx={{
              display: { xs: 'block', md: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: 'none' },
            }}
          >
            {drawer}
          </Drawer>
          {/* Masaüstü için Kalıcı Menü */}
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', md: 'block' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: 'none', backgroundColor: '#fff', boxShadow: '2px 0px 5px rgba(0,0,0,0.05)' }, // Hafif sağ gölge
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>

        {/* Ana İçerik Alanı */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3, // İç boşluk
            width: { md: `calc(100% - ${drawerWidth}px)` },
            mt: '64px', // AppBar yüksekliği kadar boşluk
            backgroundColor: 'background.default', // Açık gri arka plan
            minHeight: 'calc(100vh - 64px)', // Footer yoksa tüm yüksekliği kapla
            transition: 'margin 0.3s ease-out, width 0.3s ease-out', // İçerik alanı geçişi
          }}
          className="main-content"
        >
          {/* Seçilen içeriği göster */}
          <div className="content-transition">
             {renderContent()}
          </div>

           {/* Alt Bölüm (Footer) - Opsiyonel */}
           <Box component="footer" sx={{ mt: 4, py: 2, textAlign: 'center', color: 'text.secondary', fontSize: '0.8rem' }}>
                <Typography variant="body2">© 2025 Okul Yönetim Sistemi | Kullanım Şartları | Destek</Typography>
           </Box>
        </Box>
      </Box>
      </ThemeProvider>
  );
}
export default YonetimAnasayfa;
