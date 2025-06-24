import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
    Container, Grid, Paper, Typography, Select, MenuItem, FormControl, InputLabel,
    List, ListItem, ListItemText, ListItemAvatar, Avatar, CircularProgress, Alert,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Button,
    Dialog, DialogActions, DialogContent, DialogTitle, TextField, Box, Tooltip
} from '@mui/material';
import { AddCircleOutline, Edit, Delete, Person, Download } from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import './style/devamsizlik.css';

// Kurumsal renk paletine uygun tema oluşturma
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
            paper: '#FFFFFF',
        },
        error: {
            main: '#DC3545', // Hata Rengi: Kırmızı
        },
        warning: {
            main: '#FFA500', // Vurgu Rengi: Turuncu
        },
    },
    typography: {
        fontFamily: 'Roboto, sans-serif',
        h4: {
            fontWeight: 600,
            color: '#343A40',
        },
        h6: {
            fontWeight: 500,
            color: '#495057',
        }
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontWeight: 'bold',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                },
            },
        },
        MuiTableHead: {
            styleOverrides: {
                root: {
                    backgroundColor: '#F1F3F5',
                }
            }
        },
        MuiTableCell: {
            styleOverrides: {
                head: {
                    fontWeight: 'bold',
                    color: '#495057',
                }
            }
        }
    },
});

const API_BASE_URL = 'http://localhost:5000/api';

function DevamsizlikPage() {
    // State Tanımlamaları
    const [siniflar, setSiniflar] = useState([]);
    const [secilenSinif, setSecilenSinif] = useState('');
    const [ogrenciler, setOgrenciler] = useState([]);
    const [secilenOgrenci, setSecilenOgrenci] = useState(null);
    const [devamsizliklar, setDevamsizliklar] = useState([]);
    
    // Yüklenme ve Hata Durumları
    const [loading, setLoading] = useState({ siniflar: false, ogrenciler: false, devamsizliklar: false });
    const [error, setError] = useState(null);

    // Modal State'leri
    const [modalOpen, setModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentAbsence, setCurrentAbsence] = useState({ devamsizlik_tarihi: '', devamsizlik_turu: 'Özürsüz', aciklama: '' });

    // Veri Çekme İşlemleri
    useEffect(() => {
        // Sınıfları çek
        const fetchSiniflar = async () => {
            setLoading(prev => ({ ...prev, siniflar: true }));
            try {
                const response = await axios.get(`${API_BASE_URL}/schedule/classes`);
                const data = response.data;
                setSiniflar(data);
                setError(null);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(prev => ({ ...prev, siniflar: false }));
            }
        };
        fetchSiniflar();
    }, []);

    useEffect(() => {
        // Seçilen sınıfa göre öğrencileri çek
        if (secilenSinif) {
            const fetchOgrenciler = async () => {
                setLoading(prev => ({ ...prev, ogrenciler: true }));
                setSecilenOgrenci(null); // Sınıf değiştiğinde öğrenci seçimini sıfırla
                setOgrenciler([]);
                try {
                    const response = await axios.get(`${API_BASE_URL}/devamsizlik/ogrenciler/${secilenSinif}`);
                    const data = response.data;
                    console.log('Öğrenciler:', data); // Konsola yazdır
                    setOgrenciler(data);
                    setError(null);
                } catch (err) {
                    setError(err.message);
                } finally {
                    setLoading(prev => ({ ...prev, ogrenciler: false }));
                }
            };
            fetchOgrenciler();
        }
    }, [secilenSinif]);

    useEffect(() => {
        // Seçilen öğrenciye göre devamsızlıkları çek
        if (secilenOgrenci) {
            const fetchDevamsizliklar = async () => {
                setLoading(prev => ({ ...prev, devamsizliklar: true }));
                try {
                    const response = await axios.get(`${API_BASE_URL}/devamsizlik/ogrenci/${secilenOgrenci.id}`);
                    const data = response.data;
                    setDevamsizliklar(data);
                    setError(null);
                } catch (err) {
                    setError(err.message);
                    setDevamsizliklar([]);
                } finally {
                    setLoading(prev => ({ ...prev, devamsizliklar: false }));
                }
            };
            fetchDevamsizliklar();
        } else {
            setDevamsizliklar([]);
        }
    }, [secilenOgrenci]);

    // Toplam devamsızlık sayısını hesaplama
    const toplamDevamsizlik = useMemo(() => {
        const ozurlu = devamsizliklar.filter(d => d.devamsizlik_turu === 'Özürlü').length;
        const ozursuz = devamsizliklar.filter(d => d.devamsizlik_turu === 'Özürsüz').length;
        return { ozurlu, ozursuz, toplam: ozurlu + ozursuz };
    }, [devamsizliklar]);

    // Modal Kontrolleri
    const handleOpenModal = (absence = null) => {
        if (absence) {
            setIsEditing(true);
            setCurrentAbsence({
                ...absence,
                devamsizlik_tarihi: new Date(absence.devamsizlik_tarihi).toISOString().split('T')[0] // Tarihi formatla
            });
        } else {
            setIsEditing(false);
            setCurrentAbsence({ devamsizlik_tarihi: new Date().toISOString().split('T')[0], devamsizlik_turu: 'Özürsüz', aciklama: '' });
        }
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setIsEditing(false);
        setCurrentAbsence({ devamsizlik_tarihi: '', devamsizlik_turu: 'Özürsüz', aciklama: '' });
    };

    // CRUD İşlemleri
    const handleSaveAbsence = async () => {
        if (!secilenOgrenci) return;
        const url = isEditing ? `${API_BASE_URL}/devamsizlik/devamsizliklar/${currentAbsence.id}` : `${API_BASE_URL}/devamsizlik/devamsizliklar`;
        try {
            if (isEditing) {
                await axios.put(url, { ...currentAbsence, ogrenci_id: secilenOgrenci.id });
            } else {
                await axios.post(url, { ...currentAbsence, ogrenci_id: secilenOgrenci.id });
            }
            // Veriyi yeniden çekerek listeyi güncelle
            const updatedDevamsizliklarRes = await axios.get(`${API_BASE_URL}/devamsizlik/ogrenci/${secilenOgrenci.id}`);
            const updatedData = updatedDevamsizliklarRes.data;
            setDevamsizliklar(updatedData);
            handleCloseModal();
        } catch (err) {
            setError(err.message);
        }
    };
    
    const handleDeleteAbsence = async (id) => {
        if (window.confirm('Bu devamsızlık kaydını silmek istediğinizden emin misiniz?')) {
            try {
                await axios.delete(`${API_BASE_URL}/devamsizlik/devamsizliklar/${id}`);
                // Lokal state'i güncelleyerek anında yansıt
                setDevamsizliklar(prev => prev.filter(d => d.id !== id));
            } catch (err) {
                setError(err.message);
            }
        }
    };
    const convertAbsencesToCSV = (absences) => {
    const headers = ['Tarih', 'Türü', 'Açıklama'];
    const rows = absences.map((d) => [
        new Date(d.devamsizlik_tarihi).toLocaleDateString('tr-TR'),
        d.devamsizlik_turu,
        d.aciklama ? `"${d.aciklama.replace(/"/g, '""')}"` : ''
    ]);
    const csvContent = [headers, ...rows].map(e => e.join(',')).join('\n');
    return csvContent;
};
    const handleDownloadReport = () => {
    if (!secilenOgrenci || devamsizliklar.length === 0) return;

    const csv = convertAbsencesToCSV(devamsizliklar);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    const filename = `devamsizlik_${secilenOgrenci.ad}_${secilenOgrenci.soyad}.csv`;
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};




    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh', p: { xs: 2, md: 4 } }}>
                <Container maxWidth="xl">
                    <Typography variant="h4" gutterBottom mb={4}>
                        Devamsızlık Yönetim Paneli
                    </Typography>
                    
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    <Grid container spacing={4}>
                        {/* Sol Panel: Sınıf ve Öğrenci Seçimi */}
                        <Grid item xs={12} md={4}>
                            <Paper sx={{ p: 2 }}>
                                <FormControl fullWidth>
                                    <InputLabel id="sinif-select-label">Sınıf Seçiniz</InputLabel>
                                    <Select
                                        labelId="sinif-select-label"
                                        value={secilenSinif}
                                        label="Sınıf Seçiniz"
                                        onChange={(e) => setSecilenSinif(e.target.value)}
                                        disabled={loading.siniflar}
                                    >
                                        {loading.siniflar && <MenuItem disabled>Yükleniyor...</MenuItem>}
                                        {siniflar.map((sinif) => (
                                            <MenuItem key={sinif.id} value={sinif.id}>{sinif.ad}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Paper>
                            
                            <Paper sx={{ p: 2, mt: 3, maxHeight: '60vh', overflowY: 'auto' }}>
                                <Typography variant="h6" gutterBottom>Öğrenciler</Typography>
                                {loading.ogrenciler ? (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}><CircularProgress /></Box>
                                ) : (
                                    <List>
                                        {ogrenciler.length > 0 ? ogrenciler.map((ogrenci) => (
                                            <ListItem
                                                button
                                                key={ogrenci.id}
                                                onClick={() => setSecilenOgrenci(ogrenci)}
                                                selected={secilenOgrenci?.id === ogrenci.id}
                                                className="list-item-hover"
                                                sx={{ borderRadius: '8px' }}
                                            >
                                                <ListItemAvatar>
                                                    <Avatar sx={{ bgcolor: 'primary.main' }}><Person /></Avatar>
                                                </ListItemAvatar>
                                                <ListItemText primary={`${ogrenci.ad} ${ogrenci.soyad}`} secondary={`No: ${ogrenci.okul_no}`} />
                                            </ListItem>
                                        )) : <Typography variant="body2" color="text.secondary" align="center">Lütfen bir sınıf seçin.</Typography>}
                                    </List>
                                )}
                            </Paper>
                        </Grid>

                        {/* Sağ Panel: Devamsızlık Detayları */}
                        <Grid item xs={12} md={8}>
                           {secilenOgrenci ? (
                                <Paper sx={{ p: { xs: 2, md: 3 } }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
                                        <Typography variant="h6">{`${secilenOgrenci.ad} ${secilenOgrenci.soyad} - Devamsızlık Kayıtları`}</Typography>
                                        <Button 
                                            variant="contained" 
                                            color="secondary"
                                            startIcon={<AddCircleOutline />}
                                            onClick={() => handleOpenModal()}
                                        >
                                            Yeni Devamsızlık Ekle
                                        </Button>
                                    </Box>

                                    {/* Özet Bilgiler */}
                                    <Box sx={{ display: 'flex', gap: 2, mb: 3, p:2, backgroundColor: '#f8f9fa', borderRadius: '8px', flexWrap: 'wrap' }}>
                                        <Typography><strong>Toplam:</strong> {toplamDevamsizlik.toplam} gün</Typography>
                                        <Typography><strong>Özürlü:</strong> {toplamDevamsizlik.ozurlu} gün</Typography>
                                        <Typography><strong>Özürsüz:</strong> {toplamDevamsizlik.ozursuz} gün</Typography>
                                    </Box>

                                    {loading.devamsizliklar ? (
                                        <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}><CircularProgress /></Box>
                                    ) : (
                                        <TableContainer>
                                            <Table stickyHeader aria-label="devamsızlık tablosu">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Tarih</TableCell>
                                                        <TableCell>Türü</TableCell>
                                                        <TableCell>Açıklama</TableCell>
                                                        <TableCell align="right">İşlemler</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {devamsizliklar.length > 0 ? devamsizliklar.map((d) => (
                                                        <TableRow key={d.id} className="table-row-hover">
                                                            <TableCell>{new Date(d.devamsizlik_tarihi).toLocaleDateString('tr-TR')}</TableCell>
                                                            <TableCell>
                                                                <span className={`status-chip ${d.devamsizlik_turu === 'Özürlü' ? 'status-excused' : 'status-unexcused'}`}>
                                                                    {d.devamsizlik_turu}
                                                                </span>
                                                             </TableCell>
                                                            <TableCell>{d.aciklama || '-'}</TableCell>
                                                            <TableCell align="right">
                                                                <Tooltip title="Düzenle">
                                                                    <IconButton size="small" color="primary" onClick={() => handleOpenModal(d)}><Edit /></IconButton>
                                                                </Tooltip>
                                                                <Tooltip title="Sil">
                                                                    <IconButton size="small" color="error" onClick={() => handleDeleteAbsence(d.id)}><Delete /></IconButton>
                                                                </Tooltip>
                                                            </TableCell>
                                                        </TableRow>
                                                    )) : (
                                                        <TableRow>
                                                            <TableCell colSpan={4} align="center">
                                                                <Typography p={3}>Bu öğrenci için devamsızlık kaydı bulunamadı.</Typography>
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    )}
                                     <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                                        <Button variant="outlined" startIcon={<Download />} onClick={handleDownloadReport}>
                                            Raporu İndir
                                        </Button>
                                    </Box>
                                </Paper>
                           ) : (
                                <Paper sx={{ p: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '300px', textAlign: 'center' }}>
                                    <Typography variant="h6" color="text.secondary">
                                        Devamsızlık bilgilerini görmek için lütfen bir sınıf ve öğrenci seçiniz.
                                    </Typography>
                                </Paper>
                           )}
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Devamsızlık Ekle/Düzenle Modalı */}
            <Dialog open={modalOpen} onClose={handleCloseModal} PaperProps={{ className: 'fade-in' }}>
                <DialogTitle>{isEditing ? 'Devamsızlık Düzenle' : 'Yeni Devamsızlık Ekle'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="date"
                        label="Devamsızlık Tarihi"
                        type="date"
                        fullWidth
                        variant="outlined"
                        value={currentAbsence.devamsizlik_tarihi}
                        onChange={(e) => setCurrentAbsence({ ...currentAbsence, devamsizlik_tarihi: e.target.value })}
                        InputLabelProps={{ shrink: true }}
                        sx={{ my: 2 }}
                    />
                    <FormControl fullWidth margin="dense">
                        <InputLabel id="type-select-label">Devamsızlık Türü</InputLabel>
                        <Select
                            labelId="type-select-label"
                            value={currentAbsence.devamsizlik_turu}
                            label="Devamsızlık Türü"
                            onChange={(e) => setCurrentAbsence({ ...currentAbsence, devamsizlik_turu: e.target.value })}
                        >
                            <MenuItem value="Özürsüz">Özürsüz</MenuItem>
                            <MenuItem value="Özürlü">Özürlü</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        margin="dense"
                        id="description"
                        label="Açıklama (İsteğe Bağlı)"
                        type="text"
                        fullWidth
                        multiline
                        rows={3}
                        variant="outlined"
                        value={currentAbsence.aciklama}
                        onChange={(e) => setCurrentAbsence({ ...currentAbsence, aciklama: e.target.value })}
                        sx={{ mt: 2 }}
                    />
                </DialogContent>
                <DialogActions sx={{ p: '16px 24px' }}>
                    <Button onClick={handleCloseModal}>İptal</Button>
                    <Button onClick={handleSaveAbsence} variant="contained" color="secondary">
                        {isEditing ? 'Güncelle' : 'Kaydet'}
                    </Button>
                </DialogActions>
            </Dialog>
        </ThemeProvider>
    );
}

export default DevamsizlikPage;
