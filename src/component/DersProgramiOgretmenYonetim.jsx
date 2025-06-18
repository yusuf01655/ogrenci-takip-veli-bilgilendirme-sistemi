import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import {
    Container,
    Typography,
    Box,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Switch,
    FormControlLabel,
    Snackbar,
    Alert,
    IconButton,
    useTheme,
    useMediaQuery,
    createGlobalStyle,
    ThemeProvider
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';

// --- SABİT VERİLER VE BAŞLANGIÇ DATASI ---

const days = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma'];
const periods = ['1. Ders', '2. Ders', '3. Ders', '4. Ders', '5. Ders', '6. Ders', '7. Ders', '8. Ders'];
const timeSlots = {
    '1. Ders': '08:30 – 09:10',
    '2. Ders': '09:20 – 10:00',
    '3. Ders': '10:10 – 10:50',
    '4. Ders': '11:00 – 11:40',
    '5. Ders': '12:40 – 13:20',
    '6. Ders': '13:30 – 14:10',
    '7. Ders': '14:20 – 15:00',
    '8. Ders': '15:10 – 15:50',
};

/* const classNames = ['9/A', '9/B', '10/A', '10/B', '11/A', '11/C']; */

/* const teachers = ['Ayşe Yılmaz', 'Mehmet Öztürk', 'Fatma Kaya', 'Ali Veli', 'Zeynep Demir']; */
/* const lessonNames = ['Matematik', 'Fizik', 'Kimya', 'Biyoloji', 'Edebiyat', 'Tarih', 'Coğrafya']; */

// Örnek başlangıç verisi
const initialScheduleData = {
    '10/A': {
        'Pazartesi-2': { lesson: 'Matematik', teacher: 'Ayşe Yılmaz' },
        'Pazartesi-3': { lesson: 'Matematik', teacher: 'Ayşe Yılmaz' },
        'Salı-1': { lesson: 'Fizik', teacher: 'Mehmet Öztürk' },
        'Salı-2': { lesson: 'Fizik', teacher: 'Mehmet Öztürk' },
        'Çarşamba-5': { lesson: 'Edebiyat', teacher: 'Fatma Kaya' },
    },
    '11/C': {
        'Pazartesi-1': { lesson: 'Kimya', teacher: 'Ali Veli' },
        'Salı-3': { lesson: 'Fizik', teacher: 'Mehmet Öztürk' },
        'Perşembe-4': { lesson: 'Tarih', teacher: 'Zeynep Demir' },
    },
};

// CSS stillerini doğrudan component içine gömüyoruz.
const GlobalStyles = () => (
  <style>
    {`
      /* --- GENEL STİLLER VE FONT --- */
      body {
          font-family: 'Roboto', sans-serif;
          background-color: #F8F9FA; /* Açık Gri Arka Plan */
          margin: 0;
          padding: 0;
      }
      /* --- ANA KONTEYNER --- */
      .main-container {
          transition: all 0.5s ease-in-out;
      }
      /* --- KONTROL BUTONLARI VE SEÇİM ALANLARI --- */
      .select-control, .add-button, .save-button {
          border-radius: 8px !important;
          transition: all 0.3s ease-in-out !important;
      }
      .add-button {
          background-color: #28A745 !important; /* Yeşil */
          color: white !important;
      }
      .add-button:hover {
          background-color: #218838 !important; /* Koyu Yeşil */
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      }
      .save-button {
          background-color: #007BFF !important; /* Mavi */
      }
      .save-button:hover {
          background-color: #0056b3 !important; /* Koyu Mavi */
      }
      /* --- DERS PROGRAMI TABLOSU --- */
      .schedule-table-container {
          border-radius: 12px !important;
          overflow: hidden; /* Köşelerin yuvarlak kalmasını sağlar */
          transition: box-shadow 0.3s ease;
      }
      .schedule-table-container:hover {
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
      }
      .schedule-cell {
          cursor: pointer;
          transition: background-color 0.4s ease, transform 0.2s ease;
          position: relative;
          padding: 8px !important;
      }
      .schedule-cell:hover {
          background-color: #e9ecef !important; /* Hover için hafif gri */
      }
      .schedule-cell.empty:hover .empty-slot-icon {
          transform: scale(1.2);
          color: #007BFF;
      }
      .empty-slot-icon {
          transition: transform 0.3s ease, color 0.3s ease;
      }
      /* Dolu ders hücreleri için kart */
      .lesson-card {
          padding: 8px;
          border-radius: 8px;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          text-align: center;
          transition: all 0.3s ease;
          border-left: 5px solid transparent;
      }
      .schedule-cell.filled:hover .lesson-card {
          transform: translateY(-3px);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      }
      /* Öğretmene özel kart rengi */
      .lesson-card[sx*="e6f4ea"] { /* Yeşil tonu */
          border-left-color: #28A745;
      }
      /* Diğer dersler için kart rengi */
      .lesson-card[sx*="e3f2fd"] { /* Mavi tonu */
          border-left-color: #007BFF;
      }
      /* Çakışma durumu */
      .schedule-cell.conflict {
          animation: pulse-warning 1.5s infinite;
      }
      .lesson-card[sx*="FFA500"] { /* Turuncu */
          border-left-color: #d9534f;
      }
      @keyframes pulse-warning {
          0% {
              box-shadow: 0 0 0 0 rgba(255, 165, 0, 0.7);
          }
          70% {
              box-shadow: 0 0 0 10px rgba(255, 165, 0, 0);
          }
          100% {
              box-shadow: 0 0 0 0 rgba(255, 165, 0, 0);
          }
      }
      /* --- MODAL VE BİLDİRİM ANİMASYONLARI --- */
      @keyframes fadeIn {
          from {
              opacity: 0;
              transform: scale(0.95);
          }
          to {
              opacity: 1;
              transform: scale(1);
          }
      }
      .modal-fade .MuiDialog-paper {
          animation: fadeIn 0.4s ease-out;
      }
      .notification-fade {
          animation: fadeIn 0.5s ease;
      }
    `}
  </style>
);

// Ana Uygulama Bileşeni
export default function DersProgramiOgretmenYonetim() {
    // --- STATE'LER ---
    const [userRole, setUserRole] = useState('management'); // 'management' veya 'teacher'
    const [currentUser] = useState('Mehmet Öztürk'); // Simülasyon için mevcut öğretmen
    const [selectedClass, setSelectedClass] = useState('1');
    const [scheduleData, setScheduleData] = useState({});
    const [modalOpen, setModalOpen] = useState(false);
    const [currentCell, setCurrentCell] = useState({ day: null, period: null });
    const [currentLesson, setCurrentLesson] = useState({ lesson: '', teacher: '' });
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
    const [classNames, setClassNames] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState(''); // Seçilen öğretmen
    const [lessonNames, setLessonNames] = useState([]); // Ders adları
    const [selectedLesson, setSelectedLesson] = useState(''); // Seçilen ders adı
    // --- RESPONSIVE TASARIM İÇİN HOOK'LAR ---
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        async function fetchLessons() {
            try {
                const res = await axios.get('http://localhost:5000/api/schedule/lessons');
                const lessonList = res.data.map(row => ({ id: row.id, name: row.ad }));
                setLessonNames(lessonList);
                if (lessonList.length > 0 && !selectedLesson) setSelectedLesson(lessonList[0].id);
            } catch (err) {
                console.error('Ders listesi alınamadı:', err);
                setNotification({
                    open: true,
                    message: 'Ders listesi yüklenirken bir hata oluştu.',
                    severity: 'error'
                });
            }
        }
        fetchLessons();
    }, [selectedLesson]);

    useEffect(() => {
        async function fetchTeachers() {
            try {
                const res = await axios.get('http://localhost:5000/api/schedule/teachers');
                const teacherList = res.data.map(row => ({ id: row.id, name: row.adsoyad }));
                setTeachers(teacherList);
                if (teacherList.length > 0 && !selectedTeacher) setSelectedTeacher(teacherList[0].id);
            } catch (err) {
                console.error('Öğretmen listesi alınamadı:', err);
                setNotification({
                    open: true,
                    message: 'Öğretmen listesi yüklenirken bir hata oluştu.',
                    severity: 'error'
                });
            }
        }
        fetchTeachers();
    }, [selectedTeacher]);

    // Get all classes
    useEffect(() => {
        async function fetchClasses() {
            try {
                const res = await axios.get('http://localhost:5000/api/schedule/classes');
                const classList = res.data.map(row => ({ id: row.id, name: row.ad }));
                setClassNames(classList);
                // Set the first class as selected if none is selected
                if (classList.length > 0 && !selectedClass) {
                    setSelectedClass(classList[0].id.toString());
                }
            } catch (err) {
                console.error('Sınıf listesi alınamadı:', err);
                setNotification({
                    open: true,
                    message: 'Sınıf listesi yüklenirken bir hata oluştu.',
                    severity: 'error'
                });
            }
        }
        fetchClasses();
    }, []);

    // Fetch schedule data when selected class changes
    useEffect(() => {
        async function fetchScheduleData() {
            if (!selectedClass) return;
            
            try {
                const res = await axios.get(`http://localhost:5000/api/schedule/class/${selectedClass}`);
                const scheduleFromDB = res.data;
                
                // Convert the database format to our component's format
                const formattedSchedule = {};
                scheduleFromDB.forEach(entry => {
                    const key = `${entry.gun}-${entry.saat.split('.')[0]}`; // Convert "2. Ders" to "2"
                    formattedSchedule[key] = {
                        lesson: entry.ders_id,
                        teacher: entry.ogretmen_id,
                        scheduleId: entry.id // Store the schedule entry ID for updates
                    };
                });
                
                setScheduleData(formattedSchedule);
            } catch (err) {
                console.error('Ders programı alınamadı:', err);
                setNotification({
                    open: true,
                    message: 'Ders programı yüklenirken bir hata oluştu.',
                    severity: 'error'
                });
            }
        }
        
        fetchScheduleData();
    }, [selectedClass]);

    // Yardımcı fonksiyon: id'den öğretmen adını bul
    const getTeacherNameById = (id) => {
        const teacher = teachers.find(t => t.id === id);
        return teacher ? teacher.adsoyad : '';
    };

    // Yardımcı fonksiyon: id'den ders adını bul
    const getLessonNameById = (id) => {
        const lesson = lessonNames.find(l => l.id === id);
        return lesson ? lesson.ad : '';
    };

    // Yardımcı fonksiyon: id'den sınıf adını bul
    const getClassNameById = (id) => {
        const classObj = classNames.find(c => c.id.toString() === id.toString());
        return classObj ? classObj.name : '';
    };

    // Sınıf değişikliği için handler
    const handleClassChange = (event) => {
        const newClassId = event.target.value;
        setSelectedClass(newClassId);
    };

    // Ders değişikliği için handler
    const handleLessonChange = (event) => {
        const newLessonId = event.target.value;
        console.log('Selected lesson changed to:', newLessonId);
        setSelectedLesson(newLessonId);
    };

    // Modal'ı açan fonksiyon
    const handleCellClick = (day, period) => {
        // Sınıf seçilmemişse uyarı ver ve açma
        if (!selectedClass) {
            setNotification({ open: true, message: 'Lütfen önce bir sınıf seçin.', severity: 'warning' });
            return;
        }

        const key = `${day}-${period}`;
        const currentData = scheduleData[selectedClass]?.[key];

        // Öğretmen rolündeyse ve ders kendisine ait değilse düzenlemeyi engelle
        if (userRole === 'teacher' && currentData && currentData.teacher !== currentUser) {
            setNotification({
                open: true,
                message: 'Sadece kendi derslerinizi düzenleyebilirsiniz.',
                severity: 'warning'
            });
            return;
        }

        setCurrentCell({ day, period });
        if (currentData) {
            setCurrentLesson({
                lesson: currentData.lessonId,
                teacher: currentData.teacher
            });
            setSelectedTeacher(currentData.teacher);
            setSelectedLesson(currentData.lessonId);
        } else {
            setCurrentLesson({ lesson: '', teacher: '' });
            setSelectedTeacher(teachers[0]?.id || '');
            setSelectedLesson(lessonNames[0]?.id || '');
        }
        setModalOpen(true);
    };

    // Modal'ı kapatan fonksiyon
    const handleModalClose = () => {
        setModalOpen(false);
        setCurrentCell({ day: null, period: null });
        setCurrentLesson({ lesson: '', teacher: '' });
    };

    // Ders kaydetme ve güncelleme
    const handleSaveLesson = async () => {
        if (!selectedClass || !selectedTeacher || !selectedLesson) {
            setNotification({
                open: true,
                message: 'Lütfen tüm alanları doldurunuz.',
                severity: 'error'
            });
            return;
        }

        const { day, period } = currentCell;
        
        try {
            // Get the actual class name for the selected class ID
            const className = getClassNameById(selectedClass);
            
            console.log('Saving lesson with data:', {
                classId: className,
                day,
                period,
                lessonId: selectedLesson,
                teacherId: selectedTeacher
            });
            
            await axios.post('http://localhost:5000/api/schedule/save', {
                classId: className,
                day,
                period,
                lessonId: selectedLesson,
                teacherId: selectedTeacher
            });

            // Update local state
            const key = `${day}-${period}`;
            const updatedClassSchedule = {
                ...(scheduleData[selectedClass] || {}),
                [key]: {
                    lesson: getLessonNameById(selectedLesson),
                    lessonId: selectedLesson,
                    teacher: selectedTeacher,
                    teacherName: getTeacherNameById(selectedTeacher)
                }
            };

            setScheduleData(prev => ({
                ...prev,
                [selectedClass]: updatedClassSchedule
            }));

            setNotification({
                open: true,
                message: 'Ders başarıyla kaydedildi!',
                severity: 'success'
            });
            handleModalClose();
        } catch (err) {
            console.error('Ders kaydedilemedi:', err);
            setNotification({
                open: true,
                message: 'Ders kaydedilirken bir hata oluştu.',
                severity: 'error'
            });
        }
    };

    // Ders silme
    const handleDeleteLesson = async () => {
        const { day, period } = currentCell;
        
        try {
            await axios.post('http://localhost:5000/api/schedule/schedule/delete', {
                classId: selectedClass,
                day,
                period
            });

            const key = `${day}-${period}`;
            const updatedClassSchedule = { ...(scheduleData[selectedClass] || {}) };
            delete updatedClassSchedule[key];
            
            setScheduleData(prev => ({
                ...prev,
                [selectedClass]: updatedClassSchedule
            }));

            setNotification({
                open: true,
                message: 'Ders başarıyla silindi.',
                severity: 'success'
            });
            handleModalClose();
        } catch (err) {
            console.error('Ders silinemedi:', err);
            setNotification({
                open: true,
                message: 'Ders silinirken bir hata oluştu.',
                severity: 'error'
            });
        }
    };

    // Bildirim kapatma
    const handleNotificationClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setNotification({ ...notification, open: false });
    };
    
    // --- RENDER ---

    return (
        <>
            <GlobalStyles />
            <Container maxWidth="xl" className="main-container" sx={{ bgcolor: '#F8F9FA', py: 4 }}>
                {/* --- HEADER --- */}
                <Paper elevation={2} sx={{ p: 2, mb: 3, borderRadius: '12px' }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
                        <Typography variant="h4" component="h1" fontWeight="bold" color="#007BFF">
                            Ders Programı Yönetimi
                        </Typography>
                         <FormControlLabel
                            control={
                                <Switch
                                    checked={userRole === 'management'}
                                    onChange={(e) => setUserRole(e.target.checked ? 'management' : 'teacher')}
                                    color="primary"
                                />
                            }
                            label={userRole === 'management' ? 'Yönetici Modu' : `Öğretmen: ${currentUser}`}
                        />
                    </Box>
                </Paper>

                {/* --- KONTROL PANELİ --- */}
                <Box 
                  display="flex" 
                  flexDirection={{ xs: 'column', md: 'row' }} 
                  gap={2} 
                  mb={3} 
                  alignItems="center"
                >
                    <FormControl fullWidth sx={{ flex: 1, minWidth: '200px' }}>
                        <InputLabel id="class-select-label">Sınıf Seç</InputLabel>
                        <Select
                            labelId="class-select-label"
                            value={selectedClass || ''}
                            label="Sınıf Seç"
                            onChange={handleClassChange}
                            className="select-control"
                        >
                            {classNames.map(cls => (
                                <MenuItem key={cls.id} value={cls.id.toString()}>
                                    {cls.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    {userRole === 'management' && (
                        <Button
                            variant="contained"
                            startIcon={<AddCircleOutlineIcon />}
                            onClick={() => handleCellClick(null, null)} // Genel ekleme butonu
                            className="add-button"
                            sx={{ whiteSpace: 'nowrap' }}
                        >
                            Yeni Ders Ekle
                        </Button>
                    )}
                </Box>

                {/* --- DERS PROGRAMI TABLOSU --- */}
                <TableContainer component={Paper} elevation={3} className="schedule-table-container">
                    <Table sx={{ minWidth: 650 }} aria-label="ders programı tablosu">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', width: '120px' }}>Saat</TableCell>
                                {days.map(day => (
                                    <TableCell key={day} align="center" sx={{ fontWeight: 'bold' }}>{day}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {periods.map(period => (
                                <TableRow key={period}>
                                    <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                                        {period}
                                        <Typography variant="body2" color="text.secondary">{timeSlots[period]}</Typography>
                                    </TableCell>
                                    {days.map(day => {
                                        const key = `${day}-${period.split('.')[0]}`; // Convert "2. Ders" to "2"
                                        const scheduleEntry = scheduleData[key];
                                        
                                        return (
                                            <TableCell
                                                key={key}
                                                align="center"
                                                onClick={() => handleCellClick(day, period)}
                                                className={`schedule-cell ${scheduleEntry ? 'filled' : 'empty'}`}
                                                sx={{ 
                                                    border: '1px solid #ddd',
                                                    verticalAlign: 'top',
                                                    height: isMobile ? '80px' : '100px'
                                                }}
                                            >
                                                {scheduleEntry ? (
                                                    <Paper 
                                                        elevation={2} 
                                                        className="lesson-card"
                                                        sx={{ 
                                                            bgcolor: userRole === 'teacher' && scheduleEntry.teacher === currentUser ? '#e6f4ea' : '#e3f2fd',
                                                            height: '100%'
                                                        }}
                                                    >
                                                        <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                                                            {getLessonNameById(scheduleEntry.lesson)}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {getTeacherNameById(scheduleEntry.teacher)}
                                                        </Typography>
                                                    </Paper>
                                                ) : (
                                                    <IconButton 
                                                        className="empty-slot-icon"
                                                        sx={{ opacity: 0.5 }}
                                                    >
                                                        <AddCircleOutlineIcon />
                                                    </IconButton>
                                                )}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* --- DERS EKLEME/GÜNCELLEME MODAL --- */}
                <Dialog 
                    open={modalOpen} 
                    onClose={handleModalClose} 
                    fullWidth 
                    maxWidth="sm" 
                    className="modal-fade"
                >
                    <DialogTitle>
                        {currentCell.day && currentCell.period ? `${getClassNameById(selectedClass)} | ${currentCell.day} - ${currentCell.period}` : 'Yeni Ders Ekle'}
                        <IconButton
                            aria-label="close"
                            onClick={handleModalClose}
                            sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent dividers>
                         <Typography variant="subtitle1" gutterBottom>
                            <strong>{currentCell.day && currentCell.period ? 'Dersi Düzenle' : 'Ders Bilgilerini Girin'}</strong>
                         </Typography>
                         {!currentCell.day && (
                             <FormControl fullWidth margin="normal">
                                <InputLabel>Gün</InputLabel>
                                <Select label="Gün" value={currentCell.day || ''} onChange={(e) => setCurrentCell(prev => ({...prev, day: e.target.value}))}>
                                    {days.map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
                                </Select>
                             </FormControl>
                         )}
                         {!currentCell.period && (
                             <FormControl fullWidth margin="normal">
                                <InputLabel>Ders Saati</InputLabel>
                                <Select label="Ders Saati" value={currentCell.period || ''} onChange={(e) => setCurrentCell(prev => ({...prev, period: e.target.value}))}>
                                    {periods.map(p => <MenuItem key={p} value={p}>{p} ({timeSlots[p]})</MenuItem>)}
                                </Select>
                             </FormControl>
                         )}

                        <FormControl fullWidth margin="normal">
                            <InputLabel id="lesson-name-label">Ders Adı</InputLabel>                            <Select
                                labelId="lesson-name-label"
                                value={selectedLesson}
                                label="Ders Adı"
                                onChange={handleLessonChange}
                            >
                                {lessonNames.map(xyz => (
                                    <MenuItem key={xyz.id} value={xyz.id}>{xyz.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="teacher-name-label">Öğretmen</InputLabel>
                            <Select
                                labelId="teacher-name-label"
                                value={selectedTeacher}
                                label="Öğretmen"
                                onChange={(e) => {
                                    setSelectedTeacher(e.target.value);
                                    setCurrentLesson({ ...currentLesson, teacher: e.target.value });
                                }}
                                className="select-control"
                            >
                                {teachers.map(tcs => (
                                    <MenuItem key={tcs.id} value={tcs.id}>{tcs.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </DialogContent>
                    <DialogActions sx={{ p: '16px 24px' }}>
                        {scheduleData[selectedClass]?.[`${currentCell.day}-${currentCell.period}`] && (userRole === 'management' || scheduleData[selectedClass]?.[`${currentCell.day}-${currentCell.period}`]?.teacher === currentUser) && (
                            <Button
                                onClick={handleDeleteLesson}
                                color="error"
                                variant="outlined"
                                startIcon={<DeleteIcon />}
                            >
                                Sil
                            </Button>
                        )}
                        <Box sx={{ flex: '1 0 0' }} />
                        <Button onClick={handleModalClose} color="secondary">İptal</Button>
                        <Button onClick={handleSaveLesson} variant="contained" className="save-button">
                            Kaydet
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* --- BİLDİRİM KOMPONENTİ --- */}
                <Snackbar
                    open={notification.open}
                    autoHideDuration={4000}
                    onClose={handleNotificationClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    className="notification-fade"
                >
                    <Alert onClose={handleNotificationClose} severity={notification.severity} sx={{ width: '100%' }}>
                        {notification.message}
                    </Alert>
                </Snackbar>
            </Container>
        </>
    );
}
