import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
    Container, Box, Typography, Select, MenuItem, FormControl, InputLabel,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Button, TextField, Modal, Fade, Backdrop, IconButton, CircularProgress, Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import './style/notlandirma.css';
import DownloadIcon from '@mui/icons-material/Download';

// Arka uç API'sinin adresi
const API_URL = 'http://localhost:5000/api/notlandirma';

// Notlandirma.css dosyasını import ediyoruz


const Notlandirma = () => {
    // State'ler
    const [siniflar, setSiniflar] = useState([]);
    const [dersler, setDersler] = useState([]);
    const [ogrencilerVeNotlar, setOgrencilerVeNotlar] = useState([]);
    const [seciliSinif, setSeciliSinif] = useState('');
    const [seciliDers, setSeciliDers] = useState('');
    const [aramaMetni, setAramaMetni] = useState('');
    
    // Modal state'leri
    const [modalAcik, setModalAcik] = useState(false);
    const [seciliOgrenci, setSeciliOgrenci] = useState(null);
    const [notVerisi, setNotVerisi] = useState({ sinav1: '', sinav2: '' });

    // Yüklenme ve hata durumu state'leri
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Helper Fonksiyonlar
    const ortalamaHesapla = (s1, s2) => {
        const sinav1 = parseFloat(s1) || 0;
        const sinav2 = parseFloat(s2) || 0;
        if (s1 === null || s2 === null) return 'N/A'; // Eğer not girilmemişse
        return (sinav1 * 0.40 + sinav2 * 0.60).toFixed(2);
    };

    const durumBelirle = (ortalama) => {
        if (ortalama === 'N/A') return 'Girilmedi';
        const ort = parseFloat(ortalama);
        if (ort >= 85) return 'Pekiyi';
        if (ort >= 70) return 'İyi';
        if (ort >= 55) return 'Orta';
        if (ort >= 45) return 'Geçer';
        return 'Kaldı';
    };

    const getDurumSinifi = (durum) => {
        switch (durum) {
            case 'Pekiyi': return 'durum-pekiyi';
            case 'İyi': return 'durum-iyi';
            case 'Orta': return 'durum-orta';
            case 'Geçer': return 'durum-gecer';
            case 'Kaldı': return 'durum-kaldi';
            default: return '';
        }
    };
    
    // Veri Çekme İşlemleri
    useEffect(() => {
        // Sayfa ilk yüklendiğinde sınıfları ve dersleri çek
        const fetchData = async () => {
            try {
                const [siniflarRes, derslerRes] = await Promise.all([
                    axios.get(`${API_URL}/siniflar`),
                    axios.get(`${API_URL}/dersler`)
                ]);
                setSiniflar(siniflarRes.data);
                setDersler(derslerRes.data);
            } catch (err) {
                setError('Başlangıç verileri yüklenirken bir hata oluştu.');
                console.error(err);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        // Sınıf veya ders seçimi değiştiğinde öğrencileri ve notları çek
        if (seciliSinif && seciliDers) {
            const fetchOgrencilerVeNotlar = async () => {
                setLoading(true);
                setError(null);
                try {
                    const res = await axios.get(`${API_URL}/ogrenciler-ve-notlar/${seciliSinif}/${seciliDers}`);
                    setOgrencilerVeNotlar(res.data);
                } catch (err) {
                    setError('Öğrenci ve not bilgileri alınamadı.');
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            };
            fetchOgrencilerVeNotlar();
        } else {
             setOgrencilerVeNotlar([]); // Seçim yoksa listeyi temizle
        }
    }, [seciliSinif, seciliDers]);

    // Olay Yöneticileri (Event Handlers)
    const handleModalAc = (ogrenci) => {
        setSeciliOgrenci(ogrenci);
        setNotVerisi({
            sinav1: ogrenci.sinav1 || '',
            sinav2: ogrenci.sinav2 || ''
        });
        setModalAcik(true);
    };

    const handleModalKapat = () => {
        setModalAcik(false);
        setSeciliOgrenci(null);
        setNotVerisi({ sinav1: '', sinav2: '' });
    };


    const handleNotKaydet = async () => {
        if (!seciliOgrenci) return;
        
        const dataToSave = {
            ogrenci_id: seciliOgrenci.ogrenci_id,
            ders_id: seciliDers,
            sinav1: notVerisi.sinav1 === '' ? null : parseFloat(notVerisi.sinav1),
            sinav2: notVerisi.sinav2 === '' ? null : parseFloat(notVerisi.sinav2)
        };
        
        // Eğer not daha önce girilmemişse POST, girilmişse PUT kullanabiliriz.
        // Ama backend'i UPSERT (INSERT ... ON DUPLICATE KEY UPDATE) yapacak şekilde
        // tasarladığımız için hep POST kullanmak daha basit.
        try {
            if (seciliOgrenci.not_id) { // Not zaten var, güncelle
                 await axios.put(`${API_URL}/notlar/${seciliOgrenci.not_id}`, { sinav1: dataToSave.sinav1, sinav2: dataToSave.sinav2 });
            } else { // Yeni not, ekle
                 await axios.post(`${API_URL}/notlar`, dataToSave);
            }

            // Listeyi yenile
            const res = await axios.get(`${API_URL}/ogrenciler-ve-notlar/${seciliSinif}/${seciliDers}`);
            setOgrencilerVeNotlar(res.data);
            handleModalKapat();

        } catch (err) {
             setError('Not kaydedilirken bir hata oluştu.');
             console.error(err);
        }
    };
    
    const handleNotSil = async (notId) => {
        if (window.confirm('Bu not kaydını silmek istediğinizden emin misiniz?')) {
            try {
                await axios.delete(`${API_URL}/notlar/${notId}`);
                // Listeyi yenilemek için state'i filtrele
                setOgrencilerVeNotlar(prev => prev.map(o => o.not_id === notId ? {...o, not_id: null, sinav1: null, sinav2: null} : o));
            } catch (err) {
                 setError('Not silinirken bir hata oluştu.');
                 console.error(err);
            }
        }
    };


    const filtrelenmisOgrenciler = useMemo(() => 
        ogrencilerVeNotlar.filter(o => 
            `${o.ad} ${o.soyad}`.toLowerCase().includes(aramaMetni.toLowerCase()) ||
            o.okul_no.includes(aramaMetni)
        ), [ogrencilerVeNotlar, aramaMetni]
    );
    const convertToCSV = (data) => {
    const headers = ['Okul No', 'Ad Soyad', '1. Sınav', '2. Sınav', 'Ortalama', 'Durum'];
    const rows = data.map(o => {
        const ort = ortalamaHesapla(o.sinav1, o.sinav2);
        const durum = durumBelirle(ort);
        return [
            o.okul_no,
            `${o.ad} ${o.soyad}`,
            o.sinav1 ?? '',
            o.sinav2 ?? '',
            ort,
            durum
        ].join(',');
    });

    return [headers.join(','), ...rows].join('\n');
};
const handleDownloadReport = () => {
    const csv = convertToCSV(filtrelenmisOgrenciler); // filtrelenmiş listeyi indir
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'notlandirma_raporu.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};


    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }} className="notlandirma-container">
            <Box className="header-box">
                <Typography variant="h4" component="h1" fontWeight="bold">
                    Notlandırma Yönetim Paneli
                </Typography>
                <Typography variant="subtitle1">
                    Aşağıdakileri seçiniz
                </Typography>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Paper sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: 3 }}>
                <Typography variant="h6" gutterBottom>Filtreleme</Typography>
                <Box className="filter-box">
                    <FormControl sx={{ minWidth: 200, flex: 1 }}>
                        <InputLabel>Sınıf Seç</InputLabel>
                        <Select value={seciliSinif} label="Sınıf Seç" onChange={(e) => setSeciliSinif(e.target.value)}>
                            {siniflar.map(s => <MenuItem key={s.id} value={s.id}>{s.ad}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <FormControl sx={{ minWidth: 200, flex: 1 }} disabled={!seciliSinif}>
                        <InputLabel>Ders Seç</InputLabel>
                        <Select value={seciliDers} label="Ders Seç" onChange={(e) => setSeciliDers(e.target.value)}>
                            {dersler.map(d => <MenuItem key={d.id} value={d.id}>{d.ad}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <TextField 
                        label="Öğrenci Adı/Okul No ile Ara" 
                        variant="outlined" 
                        sx={{ flex: 2 }}
                        value={aramaMetni}
                        onChange={(e) => setAramaMetni(e.target.value)}
                        disabled={!seciliSinif || !seciliDers}
                    />
                </Box>
            </Paper>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}><CircularProgress /></Box>
            ) : seciliSinif && seciliDers ? (
                <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
                    <Table>
                        <TableHead sx={{ backgroundColor: '#007BFF' }}>
                            <TableRow>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Okul No</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Ad Soyad</TableCell>
                                <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>1. Sınav</TableCell>
                                <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>2. Sınav</TableCell>
                                <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Ortalama</TableCell>
                                <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Durum</TableCell>
                                <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>İşlemler</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filtrelenmisOgrenciler.map((ogrenci) => {
                                const ortalama = ortalamaHesapla(ogrenci.sinav1, ogrenci.sinav2);
                                const durum = durumBelirle(ortalama);
                                return (
                                <TableRow key={ogrenci.ogrenci_id} className="table-row-hover">
                                    <TableCell>{ogrenci.okul_no}</TableCell>
                                    <TableCell>{ogrenci.ad} {ogrenci.soyad}</TableCell>
                                    <TableCell align="center">{ogrenci.sinav1 ?? '—'}</TableCell>
                                    <TableCell align="center">{ogrenci.sinav2 ?? '—'}</TableCell>
                                    <TableCell align="center" sx={{fontWeight: 'bold'}}>{ortalama}</TableCell>
                                    <TableCell align="center">
                                         <Box className={`table-cell-durum ${getDurumSinifi(durum)}`}>
                                            {durum}
                                        </Box>
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton color="primary" onClick={() => handleModalAc(ogrenci)} title="Not Gir/Düzenle">
                                            <EditIcon />
                                        </IconButton>
                                        {ogrenci.not_id && (
                                            <IconButton color="error" onClick={() => handleNotSil(ogrenci.not_id)} title="Notu Sil">
                                                <DeleteIcon />
                                            </IconButton>
                                        )}
                                    </TableCell>
                                </TableRow>
                            )})}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                 <Alert severity="info">Lütfen öğrencileri listelemek için bir sınıf ve ders seçimi yapınız.</Alert>
            )}

            {/* Yönetim için Rapor İndirme Butonu */}
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                 <Button 
                    variant="contained" 
                    startIcon={<DownloadIcon />} 
                    sx={{ backgroundColor: '#28A745', '&:hover': { backgroundColor: '#218838' } }}
                    disabled={ogrencilerVeNotlar.length === 0}
                    className="action-button"
                    onClick={handleDownloadReport}
                 >
                    Raporu İndir
                 </Button>
            </Box>


            {/* Not Ekleme/Düzenleme Modalı */}
            <Modal
                open={modalAcik}
                onClose={handleModalKapat}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{ backdrop: { timeout: 500 } }}
            >
                <Fade in={modalAcik}>
                    <Box className="modal-box">
                        <Typography variant="h6" component="h2" gutterBottom>
                            Not Girişi: {seciliOgrenci?.ad} {seciliOgrenci?.soyad}
                        </Typography>
                        <TextField
                            label="1. Sınav Notu"
                            type="number"
                            fullWidth
                            margin="normal"
                            value={notVerisi.sinav1}
                            onChange={(e) => setNotVerisi({ ...notVerisi, sinav1: e.target.value })}
                            InputProps={{ inputProps: { min: 0, max: 100 } }}
                        />
                        <TextField
                            label="2. Sınav Notu"
                            type="number"
                            fullWidth
                            margin="normal"
                            value={notVerisi.sinav2}
                            onChange={(e) => setNotVerisi({ ...notVerisi, sinav2: e.target.value })}
                             InputProps={{ inputProps: { min: 0, max: 100 } }}
                        />
                        <Typography variant="caption" display="block" color="text.secondary">
                            Ortalama: {ortalamaHesapla(notVerisi.sinav1, notVerisi.sinav2)}
                             | Durum: {durumBelirle(ortalamaHesapla(notVerisi.sinav1, notVerisi.sinav2))}
                        </Typography>
                        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                            <Button onClick={handleModalKapat} color="secondary">İptal</Button>
                            <Button onClick={handleNotKaydet} variant="contained" color="primary">Kaydet</Button>
                        </Box>
                    </Box>
                </Fade>
            </Modal>
        </Container>
    );
};

export default Notlandirma;