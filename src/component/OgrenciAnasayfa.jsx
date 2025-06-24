import React, { useState } from 'react';
import {
  AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItem, ListItemButton,
  ListItemIcon, ListItemText, Box, CssBaseline, ThemeProvider, Grid, Card, CardContent,
  Button, Paper, Avatar, Chip, Divider, useTheme, useMediaQuery, Fade
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SchoolIcon from '@mui/icons-material/School'; // Okul Logosu
import AccountCircle from '@mui/icons-material/AccountCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import DashboardIcon from '@mui/icons-material/Dashboard'; // Anasayfa
import PeopleIcon from '@mui/icons-material/People'; // Öğrenci
import PersonIcon from '@mui/icons-material/Person'; // Öğretmen
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount'; // Veli
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'; // Ders Programı / Takvim
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'; // Yoklama
import AssignmentIcon from '@mui/icons-material/Assignment'; // Not
import CampaignIcon from '@mui/icons-material/Campaign'; // Duyuru
import AssessmentIcon from '@mui/icons-material/Assessment'; // Raporlar
import SettingsIcon from '@mui/icons-material/Settings'; // Ayarlar
import AddIcon from '@mui/icons-material/Add';
// VisibilityIcon kullanılmamış, gerekirse eklenebilir.
import NotificationsIcon from '@mui/icons-material/Notifications';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import InfoIcon from '@mui/icons-material/Info';
import EventNoteIcon from '@mui/icons-material/EventNote';
import BarChartIcon from '@mui/icons-material/BarChart'; // Grafik ikonu
import MessageIcon from '@mui/icons-material/Message';
import './style/yoneticianasayfa.css';
// Varsayılan tema veya kendi temanız (import path doğru olmalı)
 import customTheme from '../theme';
// Geçici olarak Material UI varsayılan temasını kullanalım
import { createTheme } from '@mui/material/styles';
const defaultTheme = createTheme(); // VEYA: import customTheme from '../theme';

// CSS dosyasının yolu doğru olmalı

// Geçici olarak CSS importunu yorum satırına alalım veya yolu düzeltin


const drawerWidth = 240;

function YoneticiAnasayfa() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme(); // Temayı içeride kullanmak için
  // isMobile değişkeni doğrudan kullanılmıyor gibi, ama kalsın
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // --- Örnek Veriler (Değişiklik Yok) ---
  const yöneticiAdi = "Ahmet Yılmaz";
  const okulAdi = "İskenderun Lisesi";
  const kpiData = {
    ogrenciSayisi: 1250,
    ogretmenSayisi: 85,
    sinifSayisi: 40,
    devamsizlikOrani: 3.5,
  };
  const bildirimler = [
    { id: 1, type: 'onay', text: 'Yeni Öğrenci Kaydı Onay Bekliyor: Elif Su', status: 'warning' },
    { id: 2, type: 'uyari', text: 'Ali Veli (10-A) devamsızlık sınırına yaklaştı.', status: 'warning' },
    { id: 3, type: 'mesaj', text: 'Sistem güncellemesi: v2.1 yayında.', status: 'info' },
    { id: 4, type: 'onay', text: 'Öğretmen İzin Talebi: Ayşe Kaya', status: 'warning' },
  ];
  const duyurular = [
    { id: 1, title: '23 Nisan Tören Provası Hk.', date: '2025-04-20' },
    { id: 2, title: 'Veli Toplantısı Tarihleri Güncellendi', date: '2025-04-18' },
    { id: 3, title: 'Yeni Yemekhane Menüsü', date: '2025-04-15' },
  ];
  const etkinlikler = [
    { id: 1, title: 'Genel Veli Toplantısı', date: '2025-04-28' },
    { id: 2, title: 'Resim Sergisi Açılışı', date: '2025-05-05' },
    { id: 3, title: 'Okul Gezisi (Anıtkabir)', date: '2025-05-10' },
  ];

  // --- Helper Fonksiyonlar (Değişiklik Yok) ---
   const getIconForNotification = (status) => {
     switch (status) {
        case 'warning': return <WarningAmberIcon color="warning" sx={{ mr: 1 }} />;
        case 'info': return <InfoIcon color="info" sx={{ mr: 1 }} />;
        default: return <NotificationsIcon color="action" sx={{ mr: 1 }} />;
     }
  }
  const getAlertClass = (status) => {
      switch (status) {
        case 'warning': return 'alert-warning';
        case 'info': return 'alert-info';
        default: return '';
     }
  }
  const handleLogout = () => {
    // JWT'yi temizle
    localStorage.removeItem('authToken'); // ya da sessionStorage
  
    // Giriş sayfasına yönlendir
    window.location.href = '/login';

    
  }

  // --- Kenar Çubuğu İçeriği ---
  const drawerContent = (
    <div>
      {/* === DEĞİŞİKLİK 1: AppBar boşluğu için standart Toolbar eklendi === */}
      <Toolbar />
      {/* === Mevcut Toolbar'ınız (Başlık vb. için) === */}
      <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 4 }}>
      
         <SchoolIcon sx={{ mr: 1, color: 'primary.main' }} />
         <Typography variant="h6" noWrap component="div" color="primary.main">
            Öğrenci Paneli
         </Typography>
      </Toolbar>
      <Divider />
      <List >
        {[
          { text: 'Anasayfa', icon: <DashboardIcon />, path: '/dashboard' },

          
          
          { text: 'Ders Programı', icon: <CalendarTodayIcon />, path: '/dersprogrami' },
          { text: 'Devamsızlık İşlemleri', icon: <CheckCircleOutlineIcon />, path: '/devamsizlik' },
          { text: 'Sınav Notları', icon: <AssignmentIcon />, path: '/notlandirma' },
          { text: 'Bildirimler', icon: <MessageIcon />, path: '/bildirimler' },
          
          { text: 'Mesaj işlemleri', icon: <MessageIcon />, path: '/mesajlar' },
          
        ].map((item, index) => (
          <ListItem key={item.text} disablePadding>
            {/* Navigasyon için React Router <Link> kullanmak daha iyidir */}
            <ListItemButton component="a" href={item.path} selected={item.text === 'Anasayfa'}>
              <ListItemIcon sx={{ minWidth: '40px' }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    // Tema Sağlayıcı: Kendi temanızı kullanıyorsanız 'defaultTheme' yerine 'customTheme' yazın
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        {/* Header */}
        <AppBar
          position="fixed"
          sx={{
            // === DEĞİŞİKLİK 2: Kalıcı Drawer varken AppBar genişliğini ve margin'ini ayarla ===
            width: { md: `calc(100% - ${drawerWidth}px)` }, // Masaüstünde genişliği ayarla
            ml: { md: `${drawerWidth}px` },                // Masaüstünde soldan boşluk bırak
            // ============================================================================
            zIndex: (theme) => theme.zIndex.drawer + 1,
            backgroundColor: 'white',
            color: theme.palette.text.primary,
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: 'none' } }} // Sadece mobilde/tablette göster
            >
              <MenuIcon />
            </IconButton>
            <SchoolIcon sx={{ mr: 1, display: { xs: 'none', sm: 'block' } }} color="primary"/>
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
              {okulAdi} Yönetim Sistemi
            </Typography>
             <Chip
                 avatar={<Avatar><AccountCircle /></Avatar>}
                 label={yöneticiAdi}
                 variant="outlined"
                 sx={{ mr: 2, display: { xs: 'none', sm: 'flex' } }}
             />
            <IconButton onClick={handleLogout} color="inherit" title="Çıkış Yap">
              <ExitToAppIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Sidebar */}
        <Box
          component="nav"
          sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
          aria-label="main navigation"
        >
          {/* Mobil için Geçici Drawer (Değişiklik Yok) */}
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              display: { xs: 'block', md: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: 'none' },
            }}
            className="sidebar-drawer"
          >
            {drawerContent}
          </Drawer>
          {/* Masaüstü için Kalıcı Drawer (Değişiklik Yok) */}
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', md: 'block' },
              '& .MuiDrawer-paper': {
                  boxSizing: 'border-box',
                  width: drawerWidth,
                  borderRight: 'none',
                  backgroundColor: '#fff',
                  boxShadow: '2px 0 5px rgba(0,0,0,0.05)'
               },
            }}
            open // Kalıcı drawer her zaman açık
            className="sidebar-drawer"
          >
            {drawerContent}
          </Drawer>
        </Box>

        {/* Ana İçerik Alanı */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 2, sm: 3 },
            width: { md: `calc(100% - ${drawerWidth}px)` }, // Bu doğru
            // === DEĞİŞİKLİK 3: AppBar altında başlaması için Toolbar eklemek ===
            // Ana içeriğin AppBar'ın altında başlamasını sağlamak için en üste bir Toolbar eklenir.
            // mt: '64px' yerine bu daha dinamik bir yöntemdir.
            backgroundColor: theme.palette.background.default,
            minHeight: '100vh' // Tam yükseklik için minHeight kullanmak daha iyi
          }}
        >
          {/* === AppBar boşluğu için Toolbar === */}
          <Toolbar />
          {/* === İçeriğiniz buradan başlıyor === */}
          <Typography variant="h5" gutterBottom sx={{ mb: 3, mt:3 }}>
            Hoş Geldiniz, {yöneticiAdi}!
          </Typography>

          {/* --- Grid ve Kartlar (Değişiklik Yok) --- */}
          <Grid container spacing={3}>
            {/* KPI Kartları */}
            <Grid item xs={12} sm={6} md={3}>
              <Card className="hover-effect-card dashboard-summary-card">
                <CardContent>
                  <PeopleIcon color="primary" sx={{ fontSize: 40, mb: 1 }}/>
                  <Typography variant="h6">{kpiData.ogrenciSayisi}</Typography>
                  <Typography variant="body2" color="text.secondary">Aktif Öğrenci</Typography>
                </CardContent>
              </Card>
            </Grid>
            {/* Diğer KPI kartları... */}
             <Grid item xs={12} sm={6} md={3}>
               <Card className="hover-effect-card dashboard-summary-card">
                <CardContent>
                  <PersonIcon color="secondary" sx={{ fontSize: 40, mb: 1 }}/>
                  <Typography variant="h6">{kpiData.ogretmenSayisi}</Typography>
                  <Typography variant="body2" color="text.secondary">Aktif Öğretmen</Typography>
                </CardContent>
              </Card>
            </Grid>
             <Grid item xs={12} sm={6} md={3}>
               <Card className="hover-effect-card dashboard-summary-card">
                <CardContent>
                  <SchoolIcon sx={{ fontSize: 40, mb: 1, color:'#6f42c1' }}/>
                  <Typography variant="h6">{kpiData.sinifSayisi}</Typography>
                  <Typography variant="body2" color="text.secondary">Toplam Şube</Typography>
                </CardContent>
              </Card>
            </Grid>
             <Grid item xs={12} sm={6} md={3}>
               <Card className="hover-effect-card dashboard-summary-card">
                <CardContent>
                   <CheckCircleOutlineIcon color="warning" sx={{ fontSize: 40, mb: 1 }}/>
                  <Typography variant="h6">%{kpiData.devamsizlikOrani}</Typography>
                  <Typography variant="body2" color="text.secondary">Günlük Devamsızlık</Typography>
                </CardContent>
              </Card>
            </Grid>


            {/* Hızlı Eylem Butonları */}
            <Grid item xs={12}>
              <Paper sx={{ p: 2, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                 <Button variant="contained" startIcon={<AddIcon />} className="quick-action-button" href="/ogrenciler">
                  Yeni Öğrenci
                </Button>
                 <Button variant="contained" color="secondary" startIcon={<AddIcon />} className="quick-action-button" href="/ogretmenler/ekle">
                  Yeni Öğretmen
                </Button>
                 <Button variant="outlined" startIcon={<CampaignIcon />} className="quick-action-button" href="/duyurular/yeni">
                  Duyuru Gönder
                </Button>
                 <Button variant="outlined" color="secondary" startIcon={<AssessmentIcon />} className="quick-action-button" href="/raporlar">
                  Raporları Görüntüle
                </Button>
              </Paper>
            </Grid>

             {/* Bildirimler & Duyurular */}
             <Grid item xs={12} md={6}>
                 <Card sx={{ minHeight: 300 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>Bildirimler & Uyarılar</Typography>
                        <List dense>
                            {bildirimler.map((item, index) => (
                                <Fade in={true} timeout={500 + index * 100} key={item.id}>
                                    <ListItem
                                        disablePadding
                                        className={`fade-in-item ${getAlertClass(item.status)}`}
                                        sx={{ mb: 1, borderRadius: 1, p: 1 }}
                                    >
                                        <ListItemIcon sx={{ minWidth: 30 }}>
                                            {getIconForNotification(item.status)}
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={item.text}
                                            primaryTypographyProps={{ variant: 'body2' }}
                                        />
                                        <Button size="small" variant="text" sx={{ ml: 1 }}>İncele</Button>
                                    </ListItem>
                                </Fade>
                            ))}
                             {bildirimler.length === 0 && <Typography variant="body2" color="text.secondary">Yeni bildirim yok.</Typography>}
                        </List>
                    </CardContent>
                </Card>
             </Grid>
             <Grid item xs={12} md={6}>
                <Card sx={{ minHeight: 300 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>Son Duyurular</Typography>
                         <List dense>
                            {duyurular.map((duyuru) => (
                                <ListItem key={duyuru.id} disablePadding sx={{ mb: 1 }}>
                                     <ListItemButton component="a" href={`/duyurular/${duyuru.id}`}>
                                         <ListItemIcon sx={{ minWidth: 30 }}><CampaignIcon fontSize="small" color="action"/></ListItemIcon>
                                        <ListItemText
                                            primary={duyuru.title}
                                            secondary={`Tarih: ${duyuru.date}`}
                                            primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                                            secondaryTypographyProps={{ variant: 'caption' }}
                                            />
                                     </ListItemButton>
                                </ListItem>
                            ))}
                            {duyurular.length === 0 && <Typography variant="body2" color="text.secondary">Gösterilecek duyuru yok.</Typography>}
                        </List>
                        <Button size="small" sx={{ mt: 1 }} href="/duyurular">Tüm Duyurular</Button>
                    </CardContent>
                </Card>
             </Grid>

             {/* Etkinlikler & Grafik */}
             <Grid item xs={12} md={6}>
                <Card sx={{ minHeight: 300 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>Yaklaşan Etkinlikler</Typography>
                         <List dense>
                            {etkinlikler.map((etkinlik) => (
                                <ListItem key={etkinlik.id} disablePadding sx={{ mb: 1 }}>
                                    <ListItemIcon sx={{ minWidth: 30 }}><EventNoteIcon fontSize="small" color="action"/></ListItemIcon>
                                    <ListItemText
                                        primary={etkinlik.title}
                                        secondary={`Tarih: ${etkinlik.date}`}
                                        primaryTypographyProps={{ variant: 'body2' }}
                                        secondaryTypographyProps={{ variant: 'caption' }}
                                    />
                                </ListItem>
                            ))}
                            {etkinlikler.length === 0 && <Typography variant="body2" color="text.secondary">Yaklaşan etkinlik bulunmamaktadır.</Typography>}
                        </List>
                    </CardContent>
                </Card>
             </Grid>
            <Grid item xs={12} md={6}>
                 <Card sx={{ minHeight: 300 }}>
                    <CardContent>
                       <Typography variant="h6" gutterBottom>Devamsızlık Trendi (Haftalık)</Typography>
                       <Box className="chart-container" sx={{ backgroundColor: '#fff', borderRadius: 1}}>
                            <BarChartIcon sx={{ fontSize: 60, color: 'lightgray' }}/>
                           <Typography color="text.secondary" sx={{ ml: 1 }}>Grafik Alanı</Typography>
                       </Box>
                    </CardContent>
                </Card>
            </Grid>

          </Grid>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default YoneticiAnasayfa;