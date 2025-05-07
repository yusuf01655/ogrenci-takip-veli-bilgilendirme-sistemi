import React, { useState, useEffect } from 'react';
import axios from 'axios';

import {
  AppBar, Toolbar, Typography, Container, Grid, List, ListItem, ListItemText,
  TextField, Button, Box, Paper, CssBaseline, useMediaQuery, createTheme,
  ThemeProvider, BottomNavigation, BottomNavigationAction, IconButton, Snackbar, Alert
} from '@mui/material';
import { Inbox as InboxIcon, Send as SendIcon, Create as CreateIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import './style/MesajIslemi.css'; // Import custom CSS

// --- Theme Configuration ---
const theme = createTheme({
  palette: {
    primary: {
      main: '#007BFF', // Blue
    },
    secondary: {
      main: '#28A745', // Green
    },
    background: {
      default: '#F8F9FA', // Light Gray
    },
    error: { // Using Accent color for potential errors or highlights
        main: '#FFA500', // Orange
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px', // Rounded corners for buttons
          textTransform: 'none', // Keep button text case as is
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '8px', // Rounded corners for paper/cards
        },
      },
    },
    MuiBottomNavigation: {
        styleOverrides: {
            root: {
                borderTop: '1px solid #e0e0e0', // Add a subtle top border
            }
        }
    }
  },
});

// --- Styled Components (Optional, for more complex styling) ---
const MessagingContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
  height: 'calc(100vh - 64px)', // Adjust based on AppBar height
  display: 'flex',
  flexDirection: 'column',
}));

const MessageListPane = styled(Paper)(({ theme }) => ({
  marginRight: theme.spacing(1),
  overflowY: 'auto',
  height: '100%', // Fill available height in Grid item
   [theme.breakpoints.down('md')]: {
        marginRight: 0,
        marginBottom: theme.spacing(1), // Add space below on mobile when stacked
   },
}));

const MessageContentPane = styled(Paper)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  padding: theme.spacing(2),
  overflowY: 'auto',
  height: '100%', // Fill available height in Grid item
  display: 'flex',
  flexDirection: 'column',
   [theme.breakpoints.down('md')]: {
        marginLeft: 0,
   },
}));

const ComposeForm = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2),
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.paper, // Ensure background contrast
}));

// --- Mock Data (Replace with API calls) ---
const mockInbox = [
  { id: 1, from: 'Principal Smith', subject: 'Welcome Back!', preview: 'Just a reminder about the assembly...', timestamp: '10:30 AM', read: false },
  { id: 2, from: 'Guidance Counselor', subject: 'Scholarship Opportunities', preview: 'Several new scholarships are available...', timestamp: 'Yesterday', read: true },
];

const mockSent = [
  { id: 3, to: 'Student Support', subject: 'Question about schedule', preview: 'I had a question regarding my math class...', timestamp: 'Tuesday' },
];

// --- Main Application Component ---
function MesajIslemi() {
  const [view, setView] = useState('inbox'); // 'inbox', 'sent', 'compose', 'messageDetail'
  const [selectedMessage, setSelectedMessage] = useState(null); // Holds the message being viewed
  const [messages, setMessages] = useState([]); // Holds the list for the current view
  const [loading, setLoading] = useState(false); // Yükleme durumu için state
  const [notification, setNotification] = useState({ // Bildirim state'i
      open: false,
      message: '',
      severity: 'info', // 'success', 'error', 'warning', 'info'
  });
  // --- Responsive Design Hook ---
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Mobile breakpoint
  const isTabletOrDesktop = useMediaQuery(theme.breakpoints.up('md')); // Tablet/Desktop breakpoint (for split view)
 // --- Backend API URL ---
    // .env dosyasından almak daha iyidir, ancak basitlik için burada tanımlayalım
    const API_URL = 'http://localhost:5000/api'; // Backend adresiniz
  // --- Fetch Messages Effect (Simulated) ---
  useEffect(() => {
    // In a real app, fetch based on 'view' from your Express API
    console.log(`Fetching ${view}...`);
    setLoading(true); // Yüklemeyi başlat
    setTimeout(() => { // API gecikmesini simüle et
    if (view === 'inbox') {
      setMessages(mockInbox);
    } else if (view === 'sent') {
      setMessages(mockSent);
    } else {
      setMessages([]); // Clear messages for compose or detail view if needed
    }
    setSelectedMessage(null); // Clear selected message when view changes
    setLoading(false); // Yüklemeyi bitir
  }, 500); // 0.5 saniye gecikme
  }, [view]);

  // --- Handlers ---
  const handleNavigationChange = (event, newValue) => {
    setView(newValue);
  };

  const handleSelectMessage = (message) => {
    // In a real app, fetch full message details here if needed
    setSelectedMessage(message);
    if (!isTabletOrDesktop) {
        setView('messageDetail'); // Switch view on mobile/tablet
    }
  };

  const handleSendMessage = async (event) => {
    event.preventDefault();
    setLoading(true); // Gönderme işlemi başlarken yükleme durumunu aktif et
    const formData = new FormData(event.currentTarget);
    const messageData = {
        to: formData.get('recipient'),
        subject: formData.get('subject'),
        body: formData.get('messageBody'),
        // --- GERÇEK UYGULAMA İÇİN NOT ---
            // senderId normalde backend'de auth ile belirlenir.
            // Eğer backend'e göndermeniz gerekiyorsa (örneğin test için):
            // senderId: 1 // Veya giriş yapmış kullanıcının ID'si
    };
    console.log('Sending message via API:', messageData);
    try {
      const token = localStorage.getItem('authToken');
      // Axios ile POST isteği gönder
      const response = await axios.post(
        `${API_URL}/messages/send`,
         messageData,
        {
          headers: {
            Authorization: `Bearer ${token}` // Token'ı header'a ekle
          }
        });

      console.log('API Response:', response.data);

      if (response.data.success) {
          // Başarılı bildirim göster
          setNotification({
              open: true,
              message: response.data.message || 'Mesaj başarıyla gönderildi!',
              severity: 'success',
          });
          // Formu temizle (opsiyonel)
          event.target.reset();
          // Gönderilenler kutusuna geç
          setView('sent');
          // TODO: Gönderilenler listesini yenilemek için API çağrısı yapabilirsiniz.
          // fetchMessages('sent');
      } else {
          // Başarısız bildirim göster (API'den gelen mesajla)
          setNotification({
              open: true,
              message: response.data.message || 'Mesaj gönderilemedi.',
              severity: 'error',
          });
      }
  } catch (error) {
      console.error('Mesaj gönderme API hatası:', error);
      // Genel hata bildirimi göster
      let errorMessage = 'Mesaj gönderilirken bir hata oluştu.';
      if (error.response && error.response.data && error.response.data.message) {
          // Backend'den gelen spesifik hata mesajını kullan
          errorMessage = error.response.data.message;
      } else if (error.request) {
          // İstek yapıldı ama yanıt alınamadı (sunucu kapalı olabilir)
          errorMessage = 'Sunucuya ulaşılamıyor. Lütfen ağ bağlantınızı kontrol edin.';
      }
      setNotification({
          open: true,
          message: errorMessage,
          severity: 'error',
      });
  } finally {
      setLoading(false); // Gönderme işlemi bittiğinde yükleme durumunu kapat
  }
   
  };

  const handleBackToList = () => {
      // Determine which list to go back to (e.g., based on previous view state)
      setView('inbox'); // Default back to inbox for simplicity
      setSelectedMessage(null);
  }
 // Bildirim kapatma işleyicisi
 const handleCloseNotification = (event, reason) => {
  if (reason === 'clickaway') {
      return;
  }
  setNotification({ ...notification, open: false });
};
  // --- Rendering Logic ---

  // Content for the main area (list or compose form)
  const renderMainContent = () => {
    if (loading && view !== 'compose') { // Compose formundayken listeyi yükleme gösterme
      return <Typography sx={{ p: 2 }}>Yükleniyor...</Typography>;
 }
    switch (view) {
      case 'compose':
        return (
          <ComposeForm component="form" onSubmit={handleSendMessage}>
            <Typography variant="h6" gutterBottom>Compose New Message</Typography>
            <TextField
              label="To (Recipient ID or Email)" // Adjust label as needed
              name="recipient"
              fullWidth
              margin="normal"
              required
              variant="outlined"
              disabled={loading} // Gönderim sırasında disable et
            />
            <TextField
              label="Subject"
              name="subject"
              fullWidth
              margin="normal"
              required
              variant="outlined"
              disabled={loading}
            />
            <TextField
              label="Message"
              name="messageBody"
              fullWidth
              margin="normal"
              required
              multiline
              rows={6}
              variant="outlined"
              inputProps={{ maxLength: 5000 }} // Example character limit
              disabled={loading}
            />
            <Button type="submit" variant="contained" color="primary" startIcon={<SendIcon />}  disabled={loading} sx={{ mt: 2 }} >
            {loading ? 'Gönderiliyor...' : 'Mesajı Gönder'}
            </Button>
          </ComposeForm>
        );
      case 'messageDetail':
        if (!selectedMessage) return <Typography sx={{ p: 2 }}>Görüntülemek için bir mesaj seçin.</Typography>;
          return (
              <Box>
                  {isMobile && ( // Show back button only on mobile when in detail view
                      <IconButton onClick={handleBackToList} sx={{ mb: 1 }}>
                          <ArrowBackIcon />
                      </IconButton>
                  )}
                  <Typography variant="h6">{selectedMessage.subject}</Typography>
                  <Typography variant="subtitle1" color="textSecondary">
                      {selectedMessage.from ? `From: ${selectedMessage.from}` : `To: ${selectedMessage.to}`}
                  </Typography>
                  <Typography variant="caption" color="textSecondary" display="block" gutterBottom>
                      {selectedMessage.timestamp}
                  </Typography>
                  <hr />
                  {/* In a real app, display the full message body here */}
                  <Typography variant="body1" sx={{ mt: 2 }}>
                      {selectedMessage.preview} ... (Full message content would go here)
                  </Typography>
                  {/* Add Reply Button */}
                   <Button
                      variant="outlined"
                      color="secondary"
                      startIcon={<CreateIcon />}
                      sx={{ mt: 3 }}
                      onClick={() => {
                          console.log("Replying to message:", selectedMessage.id);
                          // TODO: Navigate to compose view, pre-filling fields
                          setView('compose');
                          // You'd likely pass message details to pre-fill the compose form
                      }}
                    >
                      Reply
                    </Button>
              </Box>
          );
      case 'inbox':
      case 'sent':
      default:
        return (
          <List>
            {messages.length === 0 ? (
                <ListItem><ListItemText primary={`No ${view} messages.`} /></ListItem>
            ) : (
                messages.map((msg) => (
                  <ListItem
                    button // Make list item clickable
                    key={msg.id}
                    onClick={() => handleSelectMessage(msg)}
                    className={`message-item ${!msg.read && view === 'inbox' ? 'unread' : ''} ${selectedMessage?.id === msg.id && isTabletOrDesktop ? 'selected' : ''}`} // Add classes for styling
                    divider // Add dividers between items
                    selected={selectedMessage?.id === msg.id && isTabletOrDesktop} // Seçili öğeyi vurgula (Desktop)

                  >
                    <ListItemText
                      primary={view === 'inbox' ? `From: ${msg.from}` : `To: ${msg.to}`}
                      secondary={
                        <>
                          <Typography component="span" variant="body2" color="textPrimary" sx={{ fontWeight: !msg.read && view === 'inbox' ? 'bold' : 'normal' }}>
                            {msg.subject}
                          </Typography>
                          {" — "}{msg.preview}
                        </>
                      }
                    />
                     <Typography variant="caption" sx={{ ml: 2, whiteSpace: 'nowrap', fontWeight: !msg.read && view === 'inbox' ? 'bold' : 'normal' }}>{msg.timestamp}</Typography>
                  </ListItem>
                ))
            )}
          </List>
        );
    }
  };

  // --- Main Render ---
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Ensures consistent baseline styling */}
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
         {/* --- Top Navigation (App Bar) --- */}
         <AppBar position="static">
             <Toolbar>
                 <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                     Student Information System - Messages
                 </Typography>
                 {/* Add User Info/Logout button here */}
             </Toolbar>
         </AppBar>

         {/* --- Main Content Area --- */}
         <MessagingContainer maxWidth="lg" sx={{ flexGrow: 1, overflow: 'hidden' /* Prevent container scroll */ }}>
             {isTabletOrDesktop ? (
                 /* --- Desktop/Tablet: Split View --- */
                 <Grid container spacing={0} sx={{ height: '100%' }}>
                     {/* Left Pane: Message List or Compose */}
                     <Grid item md={4} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                         <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper', borderRadius: '8px 8px 0 0' }}>
                             {/* Tabs for Desktop/Tablet */}
                             <Button onClick={() => setView('inbox')} startIcon={<InboxIcon />} variant={view === 'inbox' ? 'contained' : 'text'}  disabled={loading}>Inbox</Button>
                             <Button onClick={() => setView('sent')} startIcon={<SendIcon />} variant={view === 'sent' ? 'contained' : 'text'} disabled={loading}>Sent</Button>
                             <Button onClick={() => setView('compose')} startIcon={<CreateIcon />} variant={view === 'compose' ? 'contained' : 'text'} disabled={loading}>Compose</Button>
                         </Box>
                         <MessageListPane sx={{ flexGrow: 1, borderRight: 1, borderColor: 'divider', borderRadius: '0 0 8px 8px' }}>
                         {view === 'inbox' || view === 'sent' ? renderMainContent() : <Typography sx={{ p: 2 }}>Gelen/Gönderilen kutusunu seçin veya sağdan yeni mesaj oluşturun.</Typography>}
                         </MessageListPane>
                     </Grid>
                     {/* Right Pane: Message Detail or Compose Form */}
                     <Grid item md={8} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                         <MessageContentPane>
                             {view === 'compose' ? renderMainContent() : (selectedMessage ? renderMainContent() : <Typography sx={{p: 2}}>Select a message to view.</Typography>)}
                         </MessageContentPane>
                     </Grid>
                 </Grid>
             ) : (
                 /* --- Mobile: Single View + Bottom Navigation --- */
                 <Box sx={{ height: '100%', overflowY: 'auto', paddingBottom: '56px' /* Space for bottom nav */ }}>
                     {/* Show back button if in detail view */}
                     {view === 'messageDetail' && selectedMessage && (
                         <IconButton onClick={handleBackToList} sx={{ mb: 1 }}>
                             <ArrowBackIcon />
                         </IconButton>
                     )}
                     {/* Render list, compose, or detail view */}
                     {renderMainContent()}
                 </Box>
             )}
         </MessagingContainer>

         {/* --- Bottom Navigation (Mobile Only) --- */}
         {!isTabletOrDesktop && (
             <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1 }} elevation={3}>
                 <BottomNavigation
                     showLabels
                     value={view === 'messageDetail' ? (messages === mockInbox ? 'inbox' : 'sent') : view} // Highlight correct icon even in detail view
                     onChange={handleNavigationChange}
                 >
                     <BottomNavigationAction label="Inbox" value="inbox" icon={<InboxIcon />} disabled={loading}  />
                     <BottomNavigationAction label="Sent" value="sent" icon={<SendIcon />}  disabled={loading} />
                     <BottomNavigationAction label="Compose" value="compose" icon={<CreateIcon />}  disabled={loading} />
                 </BottomNavigation>
             </Paper>
         )}
         <Snackbar
                    open={notification.open}
                    autoHideDuration={6000} // 6 saniye sonra otomatik kapat
                    onClose={handleCloseNotification}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} // Konum
                >
                    {/* Alert içeriği severity'e göre stil alır */}
                    <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
                        {notification.message}
                    </Alert>
                </Snackbar>
      </Box>
    </ThemeProvider>
  );
}

export default MesajIslemi;
