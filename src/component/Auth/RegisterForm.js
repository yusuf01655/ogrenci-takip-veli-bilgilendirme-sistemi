import React, { useState } from 'react';
import axios from 'axios';
import {
    Box, Button, TextField, Typography, CircularProgress, Alert,
    FormControl, InputLabel, Select, MenuItem, Card, CardContent, Link
} from '@mui/material';
import LockOpenIcon from '@mui/icons-material/LockOpen'; // Minimalist ikon örneği
import {Link as RouterLink} from 'react-router-dom';
const RegisterForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        rol: '', // Başlangıçta rol boş
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const { username, password, rol } = formData;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(''); // Hata mesajını temizle
        setSuccess(''); // Başarı mesajını temizle
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!username || !password || !rol) {
            setError('Tüm alanlar zorunludur.');
            return;
        }
        // İstemci tarafı ek doğrulamalar eklenebilir (örn. şifre uzunluğu)

        setLoading(true);
        try {
            // Backend API endpoint'i (yapılandırmanıza göre değişir)
            const response = await axios.post('http://localhost:5000/api/auth/register', formData);
            setSuccess(response.data.message || 'Kayıt başarıyla tamamlandı!');
            // Formu temizle
            setFormData({ username: '', password: '', rol: '' });
            // İsteğe bağlı: Kullanıcıyı login sayfasına yönlendirme
            // setTimeout(() => { history.push('/login'); }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Bir hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="register-card">
            <CardContent>
                <LockOpenIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" component="h1" className="form-title">
                    Yeni Kullanıcı Kaydı
                </Typography>
                <Box component="form" onSubmit={handleSubmit} className="register-form" noValidate>
                    <TextField
                        label="Kullanıcı Adı"
                        variant="outlined"
                        name="username"
                        value={username}
                        onChange={handleChange}
                        required
                        fullWidth
                        error={!!error.toLowerCase().includes('kullanıcı')} // Hata mesajına göre error state'i ayarla
                    />
                    <TextField
                        label="Şifre"
                        variant="outlined"
                        type="password"
                        name="password"
                        value={password}
                        onChange={handleChange}
                        required
                        fullWidth
                        error={!!error.toLowerCase().includes('şifre')}
                    />
                     <FormControl fullWidth required error={!!error.toLowerCase().includes('rol')}>
                        <InputLabel id="role-select-label">Rol</InputLabel>
                        <Select
                            labelId="role-select-label"
                            id="role-select"
                            value={rol}
                            label="Rol"
                            name="rol"
                            onChange={handleChange}
                        >
                            <MenuItem value=""><em>Rol Seçin...</em></MenuItem>
                            <MenuItem value="ogrenci">Öğrenci</MenuItem>
                            <MenuItem value="veli">Veli</MenuItem>
                            <MenuItem value="yonetici">Yönetici</MenuItem>
                            <MenuItem value="ogretmen">Öğretmen</MenuItem>
                            {/* Gerekirse başka roller eklenebilir (admin vb.) */}
                        </Select>
                    </FormControl>

                    {loading && <CircularProgress size={24} className="loading-spinner" />}

                    {error && <Alert severity="error" className="error-message">{error}</Alert>}
                    {success && <Alert severity="success" className="success-message">{success}</Alert>}


                    <Button
                        type="submit"
                        variant="contained"
                        className="submit-button"
                        disabled={loading}
                        fullWidth
                    >
                        {loading ? 'Kaydediliyor...' : 'Kaydol'}
                    </Button>
                </Box>
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                                  <Link  component= {RouterLink} to ="/login"  variant="body2" color="text.secondary">
                                       Giriş yapmak  için Tıklayın
                                  </Link>
                              </Box>
            </CardContent>
        </Card>
    );
};

export default RegisterForm;