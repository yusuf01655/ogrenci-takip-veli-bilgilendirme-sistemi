import React, { useState } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Paper,
  Fade,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Badge,
  useMediaQuery,
  styled,
  Divider,
  
} from "@mui/material";
import { useTheme } from '@mui/material/styles'; // Eğer Material UI teması kullanıyorsan
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Mail as MailIcon,
  CalendarMonth as CalendarIcon,
  MenuBook as BookIcon,
  Assessment as ReportIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
  School as SchoolIcon,
  Event as EventIcon,
  Assignment as AssignmentIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import "./style/OgretmenAnasayfa.css";
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
const drawerWidth = 240;
const collapsedWidth = 72;


const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open, sidebarCollapsed }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
    ...(sidebarCollapsed && {
      marginLeft: `-${collapsedWidth}px`,
    }),
  }),
);

const menuItems = [
  { key: "dashboard", label: "Dashboard", icon: <DashboardIcon /> },
  { key: "students", label: "Öğrenci İzleme", icon: <PeopleIcon /> },
  { key: "communication", label: "İletişim", icon: <MailIcon /> },
  { key: "calendar", label: "Takvim", icon: <CalendarIcon /> },
  { key: "materials", label: "Eğitim Materyalleri", icon: <BookIcon /> },
  { key: "reports", label: "Raporlar", icon: <ReportIcon /> },
];

const notifications = [
  { id: 1, text: "Bugün 2 öğrenciniz devamsız.", type: "info" },
  { id: 2, text: "Yarın Matematik sınavı var.", type: "warning" },
];

const students = [
  { id: 1, name: "Ahmet Yılmaz", grade: 85, absence: 2, behavior: "İyi" },
  { id: 2, name: "Ayşe Demir", grade: 92, absence: 0, behavior: "Çok İyi" },
  { id: 3, name: "Mehmet Kaya", grade: 74, absence: 1, behavior: "Orta" },
];

export default function OgretmenAnasayfa() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState("dashboard");
  const [profileAnchor, setProfileAnchor] = useState(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width:900px)");
  const theme = useTheme();
  // --- Dashboard Widget'ları ---
  const dashboardWidgets = [
    {
      icon: <PeopleIcon className="widget-icon" />,
      title: "Toplam Öğrenci",
      value: students.length,
      color: "blue",
    },
    {
      icon: <AssignmentIcon className="widget-icon" />,
      title: "Yaklaşan Ödev",
      value: "2",
      color: "orange",
    },
    {
      icon: <EventIcon className="widget-icon" />,
      title: "Bugünkü Devamsızlık",
      value: "2",
      color: "green",
    },
  ];

  // --- Menü Tıklama ---
  const handleMenuClick = (key) => setSelectedMenu(key);

  // --- Profil Menüsü ---
  const handleProfileMenu = (event) => setProfileAnchor(event.currentTarget);
  const handleProfileClose = () => setProfileAnchor(null);
  const handleProfileCloseLogout = () => {
    setProfileAnchor(null);
    handleLogout();
  }
  // --- Bildirim Modalı ---
  const handleNotifOpen = () => setNotifOpen(true);
  const handleNotifClose = () => setNotifOpen(false);

  // --- Modal Örneği (Mesaj Gönder) ---
  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);
  const handleLogout = () => {
    // JWT'yi temizle
    localStorage.removeItem('authToken'); // ya da sessionStorage
  
    // Giriş sayfasına yönlendir
    window.location.href = '/login';

    
  }

  // --- Ana İçerik ---
  const renderContent = () => {
    switch (selectedMenu) {
      case "dashboard":
        return (
          <Fade in>
            <Box className="fade-in">
              <Box className="dashboard-widgets">
                {dashboardWidgets.map((w, i) => (
                  <Paper
                    key={i}
                    className="widget-card"
                    elevation={0}
                    onClick={w.title === "Yaklaşan Ödev" ? handleModalOpen : undefined}
                    style={{ cursor: w.title === "Yaklaşan Ödev" ? "pointer" : "default" }}
                  >
                    {w.icon}
                    <Box className="widget-content">
                      <Typography className="widget-title">{w.title}</Typography>
                      <Typography
                        className={`widget-value ${
                          w.color === "green"
                            ? "green"
                            : w.color === "orange"
                            ? "orange"
                            : ""
                        }`}
                      >
                        {w.value}
                      </Typography>
                    </Box>
                  </Paper>
                ))}
              </Box>
              <Paper elevation={0} sx={{ p: 2, mb: 2 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Anlık Bildirimler
                </Typography>
                {notifications.map((n) => (
                  <Box
                    key={n.id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                      color: n.type === "warning" ? "#FFA500" : "#007BFF",
                    }}
                  >
                    <InfoIcon fontSize="small" />
                    <Typography>{n.text}</Typography>
                  </Box>
                ))}
              </Paper>
            </Box>
          </Fade>
        );
      case "students":
        return (
          <Fade in>
            <Box className="fade-in">
              <Typography variant="h6" sx={{ mb: 2 }}>
                Öğrenci Listesi
              </Typography>
              <Paper elevation={0} sx={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#e3f2fd" }}>
                      <th style={{ padding: "12px", textAlign: "left" }}>Ad Soyad</th>
                      <th style={{ padding: "12px", textAlign: "left" }}>Not</th>
                      <th style={{ padding: "12px", textAlign: "left" }}>Devamsızlık</th>
                      <th style={{ padding: "12px", textAlign: "left" }}>Davranış</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((s) => (
                      <tr key={s.id} style={{ cursor: "pointer", transition: "background 0.3s" }}>
                        <td style={{ padding: "12px" }}>{s.name}</td>
                        <td style={{ padding: "12px" }}>{s.grade}</td>
                        <td style={{ padding: "12px" }}>{s.absence}</td>
                        <td style={{ padding: "12px" }}>{s.behavior}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Paper>
            </Box>
          </Fade>
        );
      case "communication":
        return (
          <Fade in>
            <Box className="fade-in">
              <Typography variant="h6" sx={{ mb: 2 }}>
                Veliye Mesaj Gönder
              </Typography>
              <Paper elevation={0} sx={{ p: 2, maxWidth: 400 }}>
                <form>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      Veli Adı
                    </Typography>
                    <input
                      type="text"
                      placeholder="Veli adı giriniz"
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "10px",
                        border: "1px solid #e0e0e0",
                        fontFamily: "Roboto",
                        fontSize: "1rem",
                      }}
                    />
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      Mesaj
                    </Typography>
                    <textarea
                      placeholder="Mesajınızı yazınız"
                      rows={3}
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "10px",
                        border: "1px solid #e0e0e0",
                        fontFamily: "Roboto",
                        fontSize: "1rem",
                        resize: "vertical",
                      }}
                    />
                  </Box>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleModalOpen}
                    sx={{ width: "100%" }}
                  >
                    Gönder
                  </Button>
                </form>
              </Paper>
            </Box>
          </Fade>
        );
      case "calendar":
        return (
          <Fade in>
            <Box className="fade-in">
              <Typography variant="h6" sx={{ mb: 2 }}>
                Takvim
              </Typography>
              <Paper elevation={0} sx={{ p: 2 }}>
                <Typography>
                  <b>Yarın:</b> Matematik Sınavı <br />
                  <b>15 Haziran:</b> Veli Toplantısı <br />
                  <b>20 Haziran:</b> Yıl Sonu Etkinliği
                </Typography>
              </Paper>
            </Box>
          </Fade>
        );
      case "materials":
        return (
          <Fade in>
            <Box className="fade-in">
              <Typography variant="h6" sx={{ mb: 2 }}>
                Ders Planları & Materyaller
              </Typography>
              <Paper elevation={0} sx={{ p: 2 }}>
                <Typography>
                  <b>Matematik:</b> 5. Ünite Sunumu <br />
                  <b>Fen Bilimleri:</b> Deney Videosu <br />
                  <b>Türkçe:</b> Okuma Alıştırmaları PDF
                </Typography>
                <Button
                  variant="outlined"
                  color="success"
                  sx={{ mt: 2 }}
                  onClick={handleModalOpen}
                >
                  Yeni Materyal Ekle
                </Button>
              </Paper>
            </Box>
          </Fade>
        );
      case "reports":
        return (
          <Fade in>
            <Box className="fade-in">
              <Typography variant="h6" sx={{ mb: 2 }}>
                Performans Raporları
              </Typography>
              <Paper elevation={0} sx={{ p: 2 }}>
                <Typography>
                  Öğrenci performans raporlarını oluşturup PDF olarak indirebilirsiniz.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                  onClick={handleModalOpen}
                >
                  Rapor Oluştur
                </Button>
              </Paper>
            </Box>
          </Fade>
        );
      default:
        return null;
    }
  };
  
  // --- Layout ---
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", background: "#F8F9FA" }}>
      {/* Sidebar */}
      <Drawer
    variant={isMobile ? "temporary" : "permanent"}
    open={isMobile ? drawerOpen : true}
    onClose={() => setDrawerOpen(false)}
    PaperProps={{
      className: "teacher-sidebar",
      sx: {
        width: isMobile ? drawerWidth : sidebarCollapsed ? collapsedWidth : drawerWidth,
        transition: theme.transitions.create('width',{
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        boxShadow: isMobile ? 3 : 0,
        zIndex: 1200,
        overflowX: "hidden",
        '& .MuiListItemIcon-root':{
          minWidth: 'auto',
          justifyContent: 'center',
        },
        '& .MuiListItemText-root':{
          opacity: sidebarCollapsed && !isMobile ? 0 : 1,
          transition: theme.transitions.create('opacity',{
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        },
      },
    }}
    ModalProps={{
      keepMounted: true,
    }}
  >
        <List>
      {/* Collapse/Expand Butonu */}
      {!isMobile && (
        <ListItem
          button
          /* onClick={() => setSidebarCollapsed(!sidebarCollapsed)} */
          sx={{
            justifyContent: "center",
            py: 2,
            "&:hover": { background: "transparent" },
          }}
        >
          <ListItemIcon sx={{ minWidth: 0 }}>
            {sidebarCollapsed ? (
               <SchoolIcon sx={{ fontSize: 36, color: "#007BFF" }} />
            ) : (
              <SchoolIcon sx={{ fontSize: 36, color: "#007BFF" }} />
            )}
          </ListItemIcon>
        </ListItem>
      )}

      {/* Menü Öğeleri */}
      {menuItems.map((item) => (
        <ListItem
          button
          key={item.key}
          selected={selectedMenu === item.key}
          onClick={() => {
            handleMenuClick(item.key);
            if (isMobile) setDrawerOpen(false);
          }}
          sx={{
            minHeight: 48,
            px: 2.5,
            justifyContent: sidebarCollapsed && !isMobile ? "center" : "flex-start",
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: sidebarCollapsed && !isMobile ? 0 : 2,
              justifyContent: "center",
            }}
          >
            {item.icon}
          </ListItemIcon>
          
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{
                fontWeight: 500,
                fontSize: "0.875rem",
              }}
              sx = {{
                display: isMobile ? 'block' : (sidebarCollapsed ? 'none' : 'block'),
              }}
            />
          
        </ListItem>
      ))}
    </List>
      </Drawer>

      {/* Main Content */}
      <Box component = "main" sx={{ flexGrow: 1, p:3, width:`calc(100% - ${sidebarCollapsed && !isMobile ? collapsedWidth : drawerWidth}px)`,transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),...(!isMobile && {
            marginLeft: `${sidebarCollapsed ? collapsedWidth : drawerWidth}px`,
          }), }}>
        {/* Header */}
        <AppBar
          position="static"
          elevation={0}
          className="teacher-dashboard-header"
          sx={{
            background: "#fff",
            color: "#007BFF",
            borderBottom: "1px solid #e0e0e0",
            px: 2,
          }}
        >
          <Toolbar sx={{ minHeight: 64, px: 0 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {isMobile && (
  <IconButton
    edge="start"
    color="inherit"
    onClick={() => setDrawerOpen(!drawerOpen)}
    sx={{ mr: 2 }}
  >
    <MenuIcon />
  </IconButton>
)}
              <SchoolIcon sx={{ fontSize: 36, color: "#007BFF" }} />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: "#007BFF",
                  letterSpacing: 0.5,
                  fontFamily: "Roboto",
                }}
              >
                Öğretmen Anasayfası
              </Typography>
            </Box>
            <Box sx={{ flex: 1 }} />
            <Box className="profile">
              <IconButton color="primary" onClick={handleNotifOpen}>
                <Badge badgeContent={notifications.length} color="warning">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <IconButton onClick={handleProfileMenu}>
                <Avatar sx={{ bgcolor: "#007BFF" }}>Ö</Avatar>
              </IconButton>
              <Menu
                anchorEl={profileAnchor}
                open={Boolean(profileAnchor)}
                onClose={handleProfileClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <MenuItem onClick={handleProfileClose}>Profilim</MenuItem>
                <Divider />
                <MenuItem onClick={handleProfileCloseLogout}>
                  <LogoutIcon  fontSize="small" sx={{ mr: 1 }} />
                  Çıkış Yap
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Main Content Area */}
        <Box className="teacher-main-content" sx={{ flex: 1, mt:2 }}>
          {renderContent()}
        </Box>

        {/* Footer */}
        <Box className="teacher-footer">
          © 2024 Okul Yönetim Sistemi | <a href="#">Destek</a> |{" "}
          <a href="#">Gizlilik Politikası</a>
        </Box>
      </Box>

      {/* Bildirim Modal */}
      <Dialog open={notifOpen} onClose={handleNotifClose} maxWidth="xs" fullWidth>
        <DialogTitle>
          <NotificationsIcon sx={{ color: "#007BFF", mr: 1 }} />
          Bildirimler
        </DialogTitle>
        <DialogContent dividers>
          {notifications.map((n) => (
            <Box
              key={n.id}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 1,
                color: n.type === "warning" ? "#FFA500" : "#007BFF",
              }}
            >
              <InfoIcon fontSize="small" />
              <Typography>{n.text}</Typography>
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleNotifClose} color="primary">
            Kapat
          </Button>
        </DialogActions>
      </Dialog>

      {/* Genel Modal (Örnek: Mesaj Gönder, Rapor Oluştur) */}
      <Dialog open={modalOpen} onClose={handleModalClose} maxWidth="xs" fullWidth>
        <DialogTitle>İşlem Başarılı</DialogTitle>
        <DialogContent>
          <Typography>İşleminiz başarıyla gerçekleştirildi.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose} color="primary">
            Tamam
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}