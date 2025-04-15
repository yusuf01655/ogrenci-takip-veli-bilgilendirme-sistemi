// Anasayfa.jsx (Material UI versiyonu)

import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import './style/Anasayfa.css';

class Anasayfa extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false
    };
  }
  componentDidMount() {
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('Lütfen giriş yapınız.');
      window.location.href = '/login';
    }
    console.log("Anasayfa yüklendi.");
  }

  handleModalShow = () => {
    this.setState({ showModal: true });
  }

  handleModalClose = () => {
    this.setState({ showModal: false });
  }
  handleLogout = () => {
    // JWT'yi temizle
    localStorage.removeItem('authToken'); // ya da sessionStorage
  
    // Giriş sayfasına yönlendir
    window.location.href = '/login';

    
  }
  

  render() {
    return (
      <div className="page-transition">
        {/* Üst Menü (Navbar) */}
        <AppBar position="static" className="navbar">
          <Toolbar>
            <Typography variant="h6">
              Öğrenci Takip ve Veli Bilgilendirme Sistemi
            </Typography>
            <Button variant="contained" color="secondary" onClick={this.handleLogout}>
  Çıkış Yap
</Button>

          </Toolbar>
        </AppBar>

        {/* Ana İçerik */}
        <Container className="mt-4">
          <Grid container spacing={2}>
            {/* Sol Panel */}
            <Grid item xs={12} md={3} className="sidebar">
              <Card className="mb-3">
                <CardContent>
                  <Typography variant="h6">Profil</Typography>
                  <Typography>Öğrenci Adı</Typography>
                </CardContent>
              </Card>
              <Card className="mb-3">
                <CardContent>
                  <Typography variant="h6">Ders Listesi</Typography>
                  <Typography>Matematik, Fizik, Kimya...</Typography>
                </CardContent>
              </Card>
              <Card className="mb-3">
                <CardContent>
                  <Typography variant="h6">Devamsızlık Bilgileri</Typography>
                </CardContent>
              </Card>
              <Card className="mb-3">
                <CardContent>
                  <Typography variant="h6">Disiplin Kayıtları</Typography>
                  <Typography>Matematik, Fizik, Kimya...</Typography>
                </CardContent>
              </Card>
              <Card className="mb-3">
                <CardContent>
                  <Typography variant="h6">Sosyal Etkinlikler</Typography>
                  <Typography>Matematik, Fizik, Kimya...</Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Orta Bölüm */}
            <Grid item xs={12} md={6} className="content">
              <Typography variant="h4" gutterBottom>
                Hoşgeldiniz, [Öğrenci Adı]!
              </Typography>

              <Card className="mb-3 quick-summary">
                <CardContent>
                  <Typography>Devamsızlık: %5</Typography>
                  <Typography>Yaklaşan Sınav: Matematik - 12 Mayıs</Typography>
                </CardContent>
              </Card>

              <Card className="mb-3">
                <CardHeader title="Ders Programı" />
              </Card>
              <Card className="mb-3">
                <CardHeader title="Sınav Tarihleri" />
              </Card>
              <Card className="mb-3">
                <CardHeader title="Davranış Notları" />
              </Card>
              <Card className="mb-3">
                <CardHeader title="Performans Değerlendirmeleri" />
              </Card>
            </Grid>

            {/* Sağ Panel */}
            <Grid item xs={12} md={3} className="right-panel">
              <Card className="mb-3">
                <CardHeader title="Duyurular" />
                <CardContent>
                  <Typography>Acil duyuru: Sınav takvimi güncellendi.</Typography>
                </CardContent>
              </Card>

              <Button variant="contained" color="primary" onClick={this.handleModalShow}>
                Mesaj Göster
              </Button>
            </Grid>
          </Grid>
        </Container>

        {/* Modal (MUI Dialog) */}
        <Dialog open={this.state.showModal} onClose={this.handleModalClose}>
          <DialogTitle>Öğretmen Mesajı</DialogTitle>
          <DialogContent>
            <Typography>Öğrenciye özel mesaj içeriği burada yer alır.</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleModalClose} color="secondary">
              Kapat
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default Anasayfa;
