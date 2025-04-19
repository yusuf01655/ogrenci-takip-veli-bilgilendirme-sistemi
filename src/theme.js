// src/theme.js
import { createTheme } from '@mui/material/styles';

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
            main: '#DC3545', // Hata rengi (genellikle kırmızı)
        },
        warning: {
            main: '#FFA500', // Vurgular: Turuncu
        },
        text: {
            primary: '#212529', // Koyu metin (okunabilirlik için)
            secondary: '#6c757d', // Daha açık metin
        },
    },
    typography: {
        fontFamily: 'Roboto, Arial, sans-serif',
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '8px', // Köşeleri yuvarlak butonlar
                    textTransform: 'none', // Buton metni normal kalsın
                    padding: '10px 20px',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: '12px', // Köşeleri yuvarlak kartlar
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '8px', // Input alanı köşe yuvarlaklığı
                    },
                },
            },
        },
        // Diğer bileşenler için varsayılan stil tanımları...
    },
    transitions: {
        duration: {
            short: 300, // 0.3 saniye
            standard: 500, // 0.5 saniye
        },
    },
});

export default theme;