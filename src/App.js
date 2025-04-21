import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import GirisEkrani from './component/GirisEkrani';
import Anasayfa from './component/Anasayfa';
import VeliAnasayfa from './component/VeliAnasayfa';
import YonetimAnasayfa from './component/YonetimAnasayfa';
import OgretmenAnasayfa from './component/OgretmenAnasayfa';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline'; // Temel CSS sıfırlaması ve arka plan rengi için
import theme from './theme';
import RegisterPage from './pages/RegisterPage';
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUserType = localStorage.getItem('userType');
      const storedToken = localStorage.getItem('authToken');

      if (storedUserType && storedToken) {
        setIsLoggedIn(true);
        setUserType(storedUserType);
      }
    } catch (error) {
      console.error("LocalStorage okunurken hata oluştu:", error);
      localStorage.removeItem('userType');
      localStorage.removeItem('authToken');
      setIsLoggedIn(false);
      setUserType(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleLogin = (type, token) => {
    try {
      setIsLoggedIn(true);
      setUserType(type);
      localStorage.setItem('userType', type);
      localStorage.setItem('authToken', token || 'dummy-token');
      console.log('isloggedin'+isLoggedIn);
    } catch (error) {
      console.error("LocalStorage yazılırken hata oluştu:", error);
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('userType');
      localStorage.removeItem('authToken');
      setIsLoggedIn(false);
      setUserType(null);
    } catch (error) {
      console.error("LocalStorage silinirken hata oluştu:", error);
    }
  };

  if (isLoading) {
    return <div>Yükleniyor...</div>;
  }

  let HomePageComponent = Anasayfa;
  if (userType === 'veli') HomePageComponent = VeliAnasayfa;
  else if (userType === 'yonetici') HomePageComponent = YonetimAnasayfa;
  else if (userType === 'ogretmen') HomePageComponent = OgretmenAnasayfa;
  console.log('userType: ' + userType);
  return (
    <ThemeProvider theme={theme}>
            <CssBaseline /> {/* MUI tema renklerini ve temel stilleri uygular */}
    <BrowserRouter>
      <Routes>
        {!isLoggedIn ? (
          <>
          <Route path="/register" element={<RegisterPage />} />
             <Route path="*" element={<GirisEkrani onLogin={handleLogin} />} /> 
          </>
        ) : (
          <>
            <Route path="/login" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<HomePageComponent />} />
           {/*  <Route path="*" element={<Navigate to="/dashboard" />} /> */}
            <Route path="/register" element={<Navigate to="/dashboard" />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
