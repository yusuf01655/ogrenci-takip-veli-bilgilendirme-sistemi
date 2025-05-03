import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios'; // API istekleri için
import {
    Container,
    Typography,
    Button,
    Box,
    CircularProgress,
    Snackbar,
    Alert,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Grid,
    Card,
    CardContent,
    CardActions,
    useMediaQuery,
    ThemeProvider,
    createTheme,
    CssBaseline,
    Fade
    
} from '@mui/material';
import { AddCircleOutline as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Close as CloseIcon } from '@mui/icons-material';
import { TransitionProps } from '@mui/material/transitions';
import Slide from '@mui/material/Slide';

// Custom CSS import
import './style/OgrenciIslemleri.css'; // Oluşturduğumuz CSS dosyasını import ediyoruz

// API Base URL (Backend sunucunuzun adresini buraya yazın)
// Eğer backend 5000 portunda çalışıyorsa:
const API_URL = 'http://localhost:5000/api/ogrenciler';
// Eğer proxy ayarı yaptıysanız: const API_URL = '/api/ogrenciler';

// Material UI Tema Ayarları
const theme = createTheme({
    palette: {
        primary: {
            main: '#007BFF', // Ana Mavi
        },
        secondary: {
            main: '#28A745', // Tamamlayıcı Yeşil
        },
        background: {
            default: '#F8F9FA', // Açık Gri Arka Plan
        },
        error: {
            main: '#dc3545', // Kırmızı (Silme için)
        },
        warning: {
            main: '#FFA500', // Turuncu (Vurgular için)
        },
    },
    typography: {
        fontFamily: 'Roboto, sans-serif',
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 20, // Genel buton yuvarlaklığı
                    textTransform: 'none',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 8, // Kart yuvarlaklığı
                }
            }
        },
        // Dialog geçiş animasyonu
        MuiDialog: {
            defaultProps: {
                TransitionComponent: Slide, // Aşağıdan yukarı kayma efekti
                transitionDuration: { enter: 400, exit: 300 } // Geçiş süresi (ms)
            }
        },
        // Snackbar (Alert) için de benzer bir geçiş uygulanabilir
        MuiSnackbar: {
             defaultProps: {
                TransitionComponent: Fade, // Fade animasyonu
                transitionDuration: { enter: 500, exit: 300 }
             }
        }
    },
});

// Dialog için Slide Transition Component
// Slide Transition Component
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });
  
  /* // Fade Transition Component
  const Fade = React.forwardRef(function Fade(props, ref) {
    return <MuiFade ref={ref} {...props} />;
  }); */


// Ana Component
function OgrenciIslemleri() {
    const [ogrenciler, setOgrenciler] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // Genel hatalar için
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // Form State
    const [openDialog, setOpenDialog] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentOgrenci, setCurrentOgrenci] = useState({ id: null, ad: '', soyad: '', sinif: '', numara: '', veli_id: '' });
    const [formErrors, setFormErrors] = useState({}); // Form doğrulama hataları

    // Silme Onay Dialog State
    const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
    const [ogrenciToDelete, setOgrenciToDelete] = useState(null);

    // Responsive Tasarım için breakpoint kontrolü
    const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // 600px altı mobil kabul edilir

    // --- Veri Çekme ---
    const fetchOgrenciler = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            console.log("Öğrenciler çekiliyor...");
            const response = await axios.get(API_URL);
            console.log("API Yanıtı:", response.data);
            setOgrenciler(response.data || []); // Gelen veri boşsa boş array ata
        } catch (err) {
            console.error("Öğrenci verisi çekme hatası:", err);
            setError('Öğrenciler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
            setSnackbar({ open: true, message: 'Veri yüklenemedi!', severity: 'error' });
        } finally {
            setLoading(false);
            console.log("Veri çekme tamamlandı.");
        }
    }, []); // Bağımlılık yok, sadece component mount olduğunda çalışır

    useEffect(() => {
        fetchOgrenciler();
    }, [fetchOgrenciler]); // fetchOgrenciler fonksiyonu değişirse tekrar çalışır (useCallback sayesinde gereksiz çalışmaz)

    // --- Dialog İşlemleri ---
    const handleOpenDialog = (ogrenci = null) => {
        setFormErrors({}); // Form hatalarını temizle
        if (ogrenci) {
            // Düzenleme modu
            setIsEditMode(true);
            setCurrentOgrenci({ ...ogrenci, veli_id: ogrenci.veli_id || '' }); // veli_id null ise boş string yap
            console.log("Düzenleme modu açıldı:", ogrenci);
        } else {
            // Ekleme modu
            setIsEditMode(false);
            setCurrentOgrenci({ id: null, ad: '', soyad: '', sinif: '', numara: '', veli_id: '' });
            console.log("Ekleme modu açıldı.");
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        // Kısa bir gecikme ile state'i sıfırlayarak kapanma animasyonunun bitmesini bekle
        setTimeout(() => {
             setCurrentOgrenci({ id: null, ad: '', soyad: '', sinif: '', numara: '', veli_id: '' });
             setIsEditMode(false);
             setFormErrors({});
        }, 300); // Dialog transition süresi kadar
    };

    // --- Form Doğrulama ---
    const validateForm = () => {
        const errors = {};
        if (!currentOgrenci.ad.trim()) errors.ad = 'Ad zorunludur.';
        if (!currentOgrenci.soyad.trim()) errors.soyad = 'Soyad zorunludur.';
        if (!currentOgrenci.numara.trim()) errors.numara = 'Numara zorunludur.';
        // Diğer doğrulamalar eklenebilir (örn: numara formatı, veli_id'nin sayı olması vb.)
        setFormErrors(errors);
        return Object.keys(errors).length === 0; // Hata yoksa true döner
    };


    // --- Kaydetme (Ekleme/Güncelleme) ---
    const handleSave = async () => {
        if (!validateForm()) {
            console.log("Form doğrulama başarısız:", formErrors);
            return; // Doğrulama başarısızsa işlemi durdur
        }

        setLoading(true); // Butonları disable etmek ve görsel geri bildirim için
        const url = isEditMode ? `${API_URL}/${currentOgrenci.id}` : API_URL;
        const method = isEditMode ? 'put' : 'post';
        const dataToSend = {
            ...currentOgrenci,
            // veli_id boş string ise null gönder, backend'in doğru işlemesi için
            veli_id: currentOgrenci.veli_id === '' ? null : parseInt(currentOgrenci.veli_id, 10) || null
        };

        console.log(`${method.toUpperCase()} isteği gönderiliyor: ${url}`, dataToSend);

        try {
            const response = await axios[method](url, dataToSend);
            console.log("Kaydetme başarılı:", response.data);
            setSnackbar({
                open: true,
                message: response.data.message || `Öğrenci başarıyla ${isEditMode ? 'güncellendi' : 'eklendi'}.`,
                severity: 'success',
            });
            handleCloseDialog();
            fetchOgrenciler(); // Listeyi güncelle
        } catch (err) {
            console.error("Kaydetme hatası:", err.response?.data || err.message);
            const errorMessage = err.response?.data?.message || `Öğrenci ${isEditMode ? 'güncellenirken' : 'eklenirken'} bir hata oluştu.`;
            setSnackbar({ open: true, message: errorMessage, severity: 'error' });
            // Form içinde spesifik hata gösterimi (örn: numara zaten var)
            if (err.response?.status === 409) { // Conflict (Numara zaten var)
                 setFormErrors(prev => ({ ...prev, numara: errorMessage }));
            }
        } finally {
            setLoading(false);
        }
    };

    // --- Silme İşlemleri ---
    const handleOpenDeleteConfirm = (ogrenci) => {
        setOgrenciToDelete(ogrenci);
        setOpenDeleteConfirm(true);
        console.log("Silme onayı açıldı:", ogrenci);
    };

    const handleCloseDeleteConfirm = () => {
        setOpenDeleteConfirm(false);
         setTimeout(() => setOgrenciToDelete(null), 300); // Animasyon için gecikme
    };

    const handleDelete = async () => {
        if (!ogrenciToDelete) return;

        setLoading(true); // Butonları disable etmek için
        console.log(`Silme isteği gönderiliyor: ${API_URL}/${ogrenciToDelete.id}`);

        try {
            const response = await axios.delete(`${API_URL}/${ogrenciToDelete.id}`);
            console.log("Silme başarılı:", response.data);
            setSnackbar({ open: true, message: response.data.message || 'Öğrenci başarıyla silindi.', severity: 'success' });
            handleCloseDeleteConfirm();
            fetchOgrenciler(); // Listeyi güncelle
        } catch (err) {
             console.error("Silme hatası:", err.response?.data || err.message);
             const errorMessage = err.response?.data?.message || 'Öğrenci silinirken bir hata oluştu.';
            setSnackbar({ open: true, message: errorMessage, severity: 'error' });
        } finally {
             setLoading(false);
             // Silme dialogunu kapatmayı unutma (hata olsa bile)
             if (openDeleteConfirm) handleCloseDeleteConfirm();
        }
    };

    // --- Snackbar Kapatma ---
    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar({ ...snackbar, open: false });
    };

    // --- Form Alanı Değişikliklerini Yönetme ---
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setCurrentOgrenci(prev => ({ ...prev, [name]: value }));
        // Kullanıcı yazmaya başladığında ilgili alanın hatasını temizle
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    // --- Render ---
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline /> {/* Material UI'nin temel stillerini ve resetlemelerini uygular */}
            <Container maxWidth="lg" className="ogrenci-islemleri-container">
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant={isMobile ? "h5" : "h4"} component="h1" gutterBottom>
                        Öğrenci Yönetimi
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenDialog()}
                        className={isMobile ? 'full-width-mobile' : ''} // Mobilde tam genişlik
                        sx={{ flexShrink: 0 }} // Butonun küçülmesini engelle
                    >
                        Yeni Öğrenci Ekle
                    </Button>
                </Box>

                {/* Hata Mesajı */}
                {error && !loading && (
                    <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
                )}

                {/* Yükleniyor Göstergesi */}
                {loading && !openDialog && !openDeleteConfirm && ( // Dialoglar açıkken ana yükleniyor göstergesini gizle
                    <Box className="loading-container">
                        <CircularProgress />
                    </Box>
                )}

                {/* Öğrenci Listesi (Tablo veya Kartlar) */}
                {!loading && !error && (
                    isMobile ? (
                        // Mobil Görünüm: Kartlar
                        <Grid container spacing={2}>
                            {ogrenciler.length === 0 ? (
                                <Grid item xs={12}>
                                    <Typography sx={{ textAlign: 'center', mt: 4 }}>Kayıtlı öğrenci bulunamadı.</Typography>
                                </Grid>
                            ) : (
                                ogrenciler.map((ogrenci) => (
                                    <Grid item xs={12} key={ogrenci.id}>
                                        <Card variant="outlined" className="ogrenci-kart">
                                            <CardContent>
                                                <Typography variant="h6" gutterBottom>{ogrenci.ad} {ogrenci.soyad}</Typography>
                                                <Typography color="textSecondary">Numara: {ogrenci.numara}</Typography>
                                                <Typography color="textSecondary">Sınıf: {ogrenci.sinif || '-'}</Typography>
                                                <Typography color="textSecondary">Veli ID: {ogrenci.veli_id || '-'}</Typography>
                                            </CardContent>
                                            <CardActions sx={{ justifyContent: 'flex-end' }}>
                                                <IconButton size="small" onClick={() => handleOpenDialog(ogrenci)} className="edit-icon" aria-label={`Düzenle ${ogrenci.ad}`}>
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton size="small" onClick={() => handleOpenDeleteConfirm(ogrenci)} className="delete-icon" aria-label={`Sil ${ogrenci.ad}`}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                ))
                            )}
                        </Grid>
                    ) : (
                        // Masaüstü Görünüm: Tablo
                        <Paper elevation={2} sx={{ overflow: 'hidden' }}> {/* Gölge ve taşmayı engelleme */}
                            <TableContainer>
                                <Table stickyHeader className="ogrenci-tablosu" aria-label="Öğrenci Listesi Tablosu">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Ad</TableCell>
                                            <TableCell>Soyad</TableCell>
                                            <TableCell>Numara</TableCell>
                                            <TableCell>Sınıf</TableCell>
                                            <TableCell>Veli ID</TableCell>
                                            <TableCell align="right">İşlemler</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {ogrenciler.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={6} align="center">Kayıtlı öğrenci bulunamadı.</TableCell>
                                            </TableRow>
                                        ) : (
                                            ogrenciler.map((ogrenci) => (
                                                <TableRow key={ogrenci.id} hover>
                                                    <TableCell>{ogrenci.ad}</TableCell>
                                                    <TableCell>{ogrenci.soyad}</TableCell>
                                                    <TableCell>{ogrenci.numara}</TableCell>
                                                    <TableCell>{ogrenci.sinif || '-'}</TableCell>
                                                    <TableCell>{ogrenci.veli_id || '-'}</TableCell>
                                                    <TableCell align="right">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleOpenDialog(ogrenci)}
                                                            className="edit-icon"
                                                            aria-label={`Düzenle ${ogrenci.ad}`}
                                                            sx={{ mr: 1 }} // Butonlar arası boşluk
                                                        >
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleOpenDeleteConfirm(ogrenci)}
                                                            className="delete-icon"
                                                            aria-label={`Sil ${ogrenci.ad}`}
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                         </Paper>
                    )
                )}

                {/* Ekleme/Düzenleme Dialog */}
                <Dialog
                    open={openDialog}
                    onClose={handleCloseDialog}
                    TransitionComponent={Transition} // Özel geçiş efekti
                    fullWidth
                    maxWidth="sm" // Dialog genişliği
                    aria-labelledby="ogrenci-form-dialog-title"
                >
                    <DialogTitle id="ogrenci-form-dialog-title">
                        {isEditMode ? 'Öğrenci Bilgilerini Düzenle' : 'Yeni Öğrenci Ekle'}
                        <IconButton
                          aria-label="kapat"
                          onClick={handleCloseDialog}
                          sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                          }}
                        >
                          <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent dividers> {/* İçerik ile başlık/action arasına çizgi ekler */}
                        {/* <DialogContentText sx={{ mb: 2 }}>
                            Lütfen öğrenci bilgilerini girin. Yıldızlı alanlar zorunludur.
                        </DialogContentText> */}
                        <TextField
                            autoFocus // Dialog açıldığında ilk bu alana odaklan
                            margin="dense"
                            id="ad"
                            name="ad"
                            label="Ad *"
                            type="text"
                            fullWidth
                            variant="outlined" // Daha modern görünüm
                            value={currentOgrenci.ad}
                            onChange={handleInputChange}
                            error={!!formErrors.ad}
                            helperText={formErrors.ad}
                            required
                        />
                        <TextField
                            margin="dense"
                            id="soyad"
                            name="soyad"
                            label="Soyad *"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={currentOgrenci.soyad}
                            onChange={handleInputChange}
                            error={!!formErrors.soyad}
                            helperText={formErrors.soyad}
                            required
                        />
                        <TextField
                            margin="dense"
                            id="numara"
                            name="numara"
                            label="Okul Numarası *"
                            type="text" // Numara metin olarak da girilebilir (örn: E-123)
                            fullWidth
                            variant="outlined"
                            value={currentOgrenci.numara}
                            onChange={handleInputChange}
                            error={!!formErrors.numara}
                            helperText={formErrors.numara}
                            required
                        />
                        <TextField
                            margin="dense"
                            id="sinif"
                            name="sinif"
                            label="Sınıf"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={currentOgrenci.sinif}
                            onChange={handleInputChange}
                        />
                        <TextField
                            margin="dense"
                            id="veli_id"
                            name="veli_id"
                            label="Veli ID (User Tablosundan)"
                            type="number" // Sadece sayı girişi
                            fullWidth
                            variant="outlined"
                            value={currentOgrenci.veli_id}
                            onChange={handleInputChange}
                            // InputProps={{ inputProps: { min: 1 } }} // Minimum 1 olmalı gibi
                        />
                    </DialogContent>
                    <DialogActions sx={{ p: '16px 24px' }}> {/* Padding */}
                        <Button onClick={handleCloseDialog} color="inherit">
                            İptal
                        </Button>
                        <Button
                            onClick={handleSave}
                            variant="contained"
                            color={isEditMode ? "secondary" : "primary"} // Düzenlemede Yeşil, Eklemede Mavi
                            disabled={loading} // İşlem sırasında butonu devre dışı bırak
                            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                        >
                            {loading ? 'Kaydediliyor...' : (isEditMode ? 'Güncelle' : 'Kaydet')}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Silme Onay Dialog */}
                <Dialog
                    open={openDeleteConfirm}
                    onClose={handleCloseDeleteConfirm}
                    TransitionComponent={Transition}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        {"Öğrenci Silme Onayı"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {ogrenciToDelete && `${ogrenciToDelete.ad} ${ogrenciToDelete.soyad}`} isimli öğrenciyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDeleteConfirm} color="inherit">
                            İptal
                        </Button>
                        <Button onClick={handleDelete} color="error" autoFocus disabled={loading}>
                             {loading ? <CircularProgress size={20} color="inherit" /> : 'Sil'}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Snackbar Bildirimleri */}
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={4000} // 4 saniye sonra otomatik kapan
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} // Konum
                    TransitionComponent={Fade} // Fade animasyonu
                >
                    {/* Alert'i Snackbar içine yerleştirerek stil ve ikonları kullanıyoruz */}
                    <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }} variant="filled">
                        {snackbar.message}
                    </Alert>
                </Snackbar>

            </Container>
        </ThemeProvider>
    );
}

export default OgrenciIslemleri; // App.js veya router'ınızda kullanmak için export edin

// --- App.js veya Router Dosyanıza Ekleyin ---
/*
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import OgrenciIslemleri from './components/OgrenciIslemleri'; // Doğru yolu belirtin
// Diğer componentleri import edin...

function App() {
  return (
    <Router>
      <div>
        {/* Navigasyon Menüsü Örneği *\/}
        <nav>
          <ul>
            <li><Link to="/">Ana Sayfa</Link></li>
            <li><Link to="/ogrenciler">Öğrenci İşlemleri</Link></li>
            {/* Diğer linkler *\/}
          </ul>
        </nav>

        <hr />

        {/* Rotalar *\/}
        <Routes>
          <Route path="/" element={<div>Ana Sayfa İçeriği</div>} />
          <Route path="/ogrenciler" element={<OgrenciIslemleri />} />
          {/* Diğer rotalar *\/}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
*/
