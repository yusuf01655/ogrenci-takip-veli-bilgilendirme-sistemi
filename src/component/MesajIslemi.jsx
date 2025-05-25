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
  minWidth: '300px',
  [theme.breakpoints.up('lg')]: {
    minWidth: '800px', // Wider pane for large screens
       maxWidth:'900px', /* Sağ panel genişliği */
      margin: '0 auto',
      
    padding: '32px', /* Daha geniş padding */
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', /* Hafif gölge */
    borderRadius: '12px', /* Yuvarlatılmış köşeler */
    

   
   

    padding: theme.spacing(4), // Increase padding for better spacing
  },
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
  /* useEffect(() => {
    
    console.log(`Fetching ${view}...`);
    setLoading(true);
    setTimeout(() => { 
    if (view === 'inbox') {
      setMessages(mockInbox);
    } else if (view === 'sent') {
      setMessages(mockSent);
    } else {
      setMessages([]); 
    }
    setSelectedMessage(null); 
    setLoading(false); 
  }, 500); 
  }, [view]); */
   const renderMessageList = () => {
    if (messages.length === 0 && !loading) {
      return (
        <ListItem>
          <ListItemText primary={`No ${view} messages.`} sx={{ textAlign: 'center' }} />
        </ListItem>
      );
    }
    return (
      <List>
        {messages.map((msg) => (
          <ListItem
            button="true"
            key={msg.id}
            onClick={() => handleSelectMessage(msg)}
            className={`message-item ${!msg.read && view === 'inbox' ? 'unread' : ''} ${selectedMessage?.id === msg.id && isTabletOrDesktop ? 'selected' : ''}`}
            divider
            selected={selectedMessage?.id === msg.id && isTabletOrDesktop}
          >
            <ListItemText
              primary={
                <Typography component="span" sx={{ fontWeight: view === 'inbox' && !msg.is_read ? 'bold' : 'normal' }}>
                  {view === 'inbox' ? `From: ${msg.sender_name || msg.from_user_id}` : `To: ${msg.receiver_name || msg.to_user_id}`}
                </Typography>
              }
              secondary={
                <>
                  <Typography component="span" variant="body2" color="textPrimary" sx={{ fontWeight: view === 'inbox' && !msg.is_read ? 'bold' : 'normal' }}>
                    {msg.subject || "(No Subject)"}
                  </Typography>
                  {" — "}
                  {msg.preview || (msg.body ? msg.body.substring(0, 50) + '...' : 'No preview')}
                </>
              }
            />
            <Typography variant="caption" sx={{ ml: 2, whiteSpace: 'nowrap', fontWeight: view === 'inbox' && !msg.is_read ? 'bold' : 'normal' }}>
              {msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' }) : ""}
              <br/>
              {msg.created_at ? new Date(msg.created_at).toLocaleDateString() : ""}
            </Typography>
          </ListItem>
        ))}
      </List>
    );
  };
    const renderMessageDetails = () => {
    if (!selectedMessage) return <Typography sx={{ p: 2 }}>Görüntülemek için bir mesaj seçin.</Typography>;
    return (
      <Box sx={{ textAlign: 'left', maxHeight: '80vh', overflowY: 'auto', padding: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          {selectedMessage.from_user_id 
            ? `Kimden: ${selectedMessage.sender_name || selectedMessage.from_user_id}`
            : `Kime: ${selectedMessage.receiver_name || selectedMessage.to_user_id}`}
        </Typography>
        <Typography variant="h6" gutterBottom>
          Konu: {selectedMessage.subject || "No Subject"}
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          Tarih: {selectedMessage.created_at ? new Date(selectedMessage.created_at).toLocaleDateString() : "No timestamp"} &nbsp;
          Saat: {selectedMessage.created_at ? new Date(selectedMessage.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ""}
        </Typography>
        <hr style={{ margin: '16px 0' }}/>
        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', mb: 3 }}>
          {selectedMessage.body || "Mesaj içeriği bulunamadı."}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" color="secondary" startIcon={<CreateIcon />} onClick={handleReply}>
            Yanıtla
          </Button>
          <Button style={{ display: 'none' }} variant="outlined" color="error" onClick={handleDeleteMessage}>
            Sil
          </Button>
          <Button style={{ display: 'none' }} variant="outlined" onClick={handleMarkAsReadUnread}>
            {selectedMessage.read ? 'Okunmadı olarak işaretle' : 'Okundu olarak işaretle'}
          </Button>
        </Box>
      </Box>
    );
  };
 const handleDeleteMessage = async () => {
    if (!selectedMessage) return;
    try {
      const response = await axios.delete(`${API_URL}/messages/${selectedMessage.id}`);
      if (response.data.success) {
        setNotification({
          open: true,
          message: 'Mesaj başarıyla silindi.',
          severity: 'success',
        });
        setMessages(messages.filter((msg) => msg.id !== selectedMessage.id));
        setSelectedMessage(null);
      } else {
        setNotification({
          open: true,
          message: response.data.message || 'Mesaj silinemedi.',
          severity: 'error',
        });
      }
    } catch (error) {
      console.error('Mesaj silme API hatası:', error);
      setNotification({
        open: true,
        message: 'Mesaj silinirken bir hata oluştu.',
        severity: 'error',
      });
    }
  };
const handleMarkAsReadUnread = async () => {
    if (!selectedMessage) return;
    try {
      const updatedMessage = { ...selectedMessage, read: !selectedMessage.read };
      const response = await axios.put(`${API_URL}/messages/${selectedMessage.id}`, updatedMessage);
      if (response.data.success) {
        setNotification({
          open: true,
          message: `Mesaj ${updatedMessage.read ? 'okundu olarak işaretlendi' : 'okunmadı olarak işaretlendi'}.`,
          severity: 'success',
        });
        setMessages(
          messages.map((msg) =>
            msg.id === selectedMessage.id ? { ...msg, read: updatedMessage.read } : msg
          )
        );
        setSelectedMessage(updatedMessage);
      } else {
        setNotification({
          open: true,
          message: response.data.message || 'Mesaj durumu güncellenemedi.',
          severity: 'error',
        });
      }
    } catch (error) {
      console.error('Mesaj durumu güncelleme API hatası:', error);
      setNotification({
        open: true,
        message: 'Mesaj durumu güncellenirken bir hata oluştu.',
        severity: 'error',
      });
    }
  };
  const handleReply = () => {
    if (!selectedMessage) return;
    setView('compose');
    setTimeout(() => {
      // Pre-fill the compose form
      const form = document.querySelector('form');
      if (form) {
        form.recipient.value = selectedMessage.sender_name || selectedMessage.from_user_id;
        form.subject.value = `Re: ${selectedMessage.subject}`;
        form.messageBody.value = `\n\n--- Orijinal Mesaj ---\n${selectedMessage.body}`;
      }
    }, 0);
  };
  // --- Function to fetch messages ---
  const fetchMessages = async (type) => {
    setLoading(true);
    setSelectedMessage(null); // Clear selected message when fetching new list
    let endpoint = `${API_URL}/messages`; // Default: fetches all messages

    // For a real application, you'd get the current logged-in user's ID
    const currentUserId = 5; // Placeholder: Get this from your auth context or localStorage

    if (type === 'inbox') {
      // endpoint = `${API_URL}/messages`; // Original request: all messages
      endpoint = `${API_URL}/messages/inbox?userId=${currentUserId}`; // Typical inbox: messages for current user
    } else if (type === 'sent') {
      endpoint = `${API_URL}/messages/sent?userId=${currentUserId}`; // Sent messages by current user
    } else {
      setMessages([]);
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('authToken'); // If using token auth
      const response = await axios.get(endpoint, {
        // headers: {
        //   'Authorization': `Bearer ${token}` // Include if your API is protected
        // }
      });
      if (response.data && response.data.success) {
        // Ensure the fetched data matches the structure expected by your ListItemText
        // The backend should format it to: id, from, subject, preview, timestamp, body, read
        setMessages(response.data.messages || []);
      } else {
        setMessages([]);
        setNotification({
            open: true,
            message: response.data.message || 'Mesajlar yüklenemedi.',
            severity: 'error',
        });
      }
    } catch (error) {
      console.error(`Error fetching ${type} messages:`, error);
      setMessages([]);
      let errorMessage = `Mesajlar yüklenirken bir hata oluştu (${type}).`;
      if (error.response && error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
      } else if (error.request) {
          errorMessage = 'Sunucuya ulaşılamıyor. Lütfen ağ bağlantınızı kontrol edin.';
      }
      setNotification({
          open: true,
          message: errorMessage,
          severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };
    // --- Fetch Messages Effect ---
  useEffect(() => {
    console.log(`Workspaceing ${view}...`);
    if (view === 'inbox' || view === 'sent') {
      fetchMessages(view);
    } else {
    /*   setMessages([]); // Clear messages for compose or detail view if needed
      setSelectedMessage(null); */
    }
  }, [view]); // Re-fetch when 'view' changes
  // --- Handlers ---
  const handleNavigationChange = (event, newValue) => {
     // Prevent navigating away if currently loading, or to the same view if not messageDetail
    if (loading && newValue !== view) return;
    if (newValue !== 'messageDetail') { // messageDetail is handled by handleSelectMessage
        setView(newValue);
    }
  };

  const handleSelectMessage = async (message) => {
    // OPTIONAL: Fetch full message details if preview isn't enough
    // For now, we assume 'body' is already fetched with the list
    // You might also mark the message as 'read' on the backend here
    // e.g., await axios.put(`${API_URL}/messages/read/${message.id}`);

    setSelectedMessage(message); // The message object from backend should have 'body'
    if (!isTabletOrDesktop) {
      setView('messageDetail');
    }
    // Optionally, update the message in the list to mark as read visually
    // setMessages(prevMessages => prevMessages.map(m => m.id === message.id ? {...m, read: true} : m));
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
    // Determine which list to go back to.
    // This logic assumes 'from' means inbox and 'to' means sent.
    // You might need a more robust way to determine the origin view.
    if (selectedMessage) {
        // A more robust way would be to store the previous view before going to messageDetail
        // For now, this heuristic might work.
        const wasInbox = messages.some(m => m.id === selectedMessage.id && m.from_user_id); // Example: check if it has a 'from_user_id'
        const wasSent = messages.some(m => m.id === selectedMessage.id && m.to_user_id); // Example: check if it has a 'to_user_id'

        if (wasInbox) setView('inbox');
        else if (wasSent) setView('sent');
        else setView('inbox'); // Default fallback
    } else {
        setView('inbox'); // Default if no message was selected
    }
    setSelectedMessage(null); // Clear selected message
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
    if (loading && (view === 'inbox' || view === 'sent')) { // Compose formundayken listeyi yükleme gösterme
      return <Typography sx={{ p: 2 , textAlign: 'center' }}>Yükleniyor...</Typography>;
 }
 // New branch for tablet/desktop detail view: only display the selected message’s details
    if (isTabletOrDesktop && selectedMessage) {
        return (
            <Box sx={{ textAlign: 'left', maxHeight: '80vh', overflowY: 'auto', padding: 2 }}>
                {/* Who is the message from (or to) */}
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    {selectedMessage.from_user_id 
                        ? `Kimden: ${selectedMessage.sender_name || selectedMessage.from_user_id}` 
                        : `Kime: ${selectedMessage.receiver_name || selectedMessage.to_user_id}`}
                </Typography>
                {/* Subject */}
                <Typography variant="h6" gutterBottom>
                    Konu: {selectedMessage.subject || "No Subject"}
                </Typography>
                {/* Date and time */}
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                    Tarih: {selectedMessage.created_at ? new Date(selectedMessage.created_at).toLocaleDateString() : "No timestamp"} &nbsp;
                    Saat: {selectedMessage.created_at ? new Date(selectedMessage.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ""}
                </Typography>
                <hr style={{ margin: '16px 0' }}/>
                {/* Message content */}
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', mb: 3 }}>
                    {selectedMessage.body || "Mesaj içeriği bulunamadı."}
                </Typography>
                {/* Action buttons side by side */}
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button variant="outlined" color="secondary" startIcon={<CreateIcon />} onClick={handleReply}>
                        Yanıtla
                    </Button>
                    <Button style={{ display: 'none' }} variant="outlined" color="error" onClick={handleDeleteMessage}>
                        Sil
                    </Button>
                    <Button style={{ display: 'none' }} variant="outlined" onClick={handleMarkAsReadUnread}>
                        {selectedMessage.read ? 'Okunmadı olarak işaretle' : 'Okundu olarak işaretle'}
                    </Button>
                </Box>
            </Box>
        );
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
      case 'messageDetail': //burdayım incelemede
        if (!selectedMessage) return <Typography sx={{ p: 2 }}>Görüntülemek için bir mesaj seçin.</Typography>;
          return (
              <Box>
                  {isMobile && ( // Show back button only on mobile when in detail view
                      <IconButton onClick={handleBackToList} sx={{ mb: 1 ,display: { md: 'none' }}}>
                          <ArrowBackIcon />
                      </IconButton>
                  )}
                  <Typography variant="h6" gutterBottom >{selectedMessage.subject|| "No Subject"}</Typography>
                  <Typography variant="subtitle1" color="textSecondary">
                      {selectedMessage.from_user_id  ? `From: ${selectedMessage.sender_name || selectedMessage.from_user_id}` : `To: ${selectedMessage.receiver_name || selectedMessage.to_user_id}`}
                  </Typography>
                  <Typography variant="caption" color="textSecondary" display="block" gutterBottom>
                      {selectedMessage.created_at ? new Date(selectedMessage.created_at).toLocaleString() : "No timestamp"}
                  </Typography>
                  <hr style={{ margin: '16px 0' }}/>
                  {/* In a real app, display the full message body here */}
                  <Typography variant="body1" sx={{ mt: 2, whiteSpace: 'pre-wrap', wordBreak: 'break-word' /* To respect newlines in message */ }}>
                      {selectedMessage.body || "Full message content is not available."}
                  </Typography>
                  {/* Add Reply Button */}
                  <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                   <Button
                      variant="outlined"
                      color="secondary"
                      startIcon={<CreateIcon />}
                      sx={{ mt: 3 }}
                      onClick={handleReply}
                    >
                      Reply
                    </Button>
                    <Button
                variant="outlined"
                color="error"
                onClick={handleDeleteMessage}
                style={{ display: 'none' }}
              >
                Delete
              </Button>
              <Button
                variant="outlined"
                onClick={handleMarkAsReadUnread}
                style={{ display: 'none' }}
              >
                {selectedMessage.read ? 'Mark as Unread' : 'Mark as Read'}
              </Button>
              </Box>
              </Box>
          );
      case 'inbox':
      case 'sent':
      default:
        if (messages.length === 0 && !loading) {
                  return <ListItem><ListItemText primary={`No ${view} messages.`} sx={{textAlign: 'center'}} /></ListItem>;
                }
        return (
          <List>
            {
                messages.map((msg) => (
                  <ListItem
                    button="true" // Make list item clickable
                    key={msg.id}
                    onClick={() => handleSelectMessage(msg)}
                    className={`message-item ${!msg.read && view === 'inbox' ? 'unread' : ''} ${selectedMessage?.id === msg.id && isTabletOrDesktop ? 'selected' : ''}`} // Add classes for styling
                    divider // Add dividers between items
                    selected={selectedMessage?.id === msg.id && isTabletOrDesktop} // Seçili öğeyi vurgula (Desktop)

                  >
                    <ListItemText
                      primary={
                                          <Typography component="span" sx={{ fontWeight: view === 'inbox' && !msg.is_read ? 'bold' : 'normal' }}>
                                               {view === 'inbox' ? `From: ${msg.sender_name || msg.from_user_id}` : `To: ${msg.receiver_name || msg.to_user_id}`}
                                          </Typography>}
                      secondary={  
                        <>
                          <Typography component="span" variant="body2" color="textPrimary" sx={{ fontWeight: view === 'inbox' && !msg.is_read ? 'bold' : 'normal' }}>
                           {msg.subject || "(No Subject)"}
                          </Typography>
                          {" — "}{msg.preview || (msg.body ? msg.body.substring(0, 50) + '...' : 'No preview')}
                        </>
                      }
                    />
                     <Typography variant="caption" sx={{ ml: 2, whiteSpace: 'nowrap', fontWeight: view === 'inbox' && !msg.is_read  ? 'bold' : 'normal' }}>
                                         {msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ""}
                                         <br/>
                                         {msg.created_at ? new Date(msg.created_at).toLocaleDateString() : ""}
                                     </Typography>
                  </ListItem>
                ))
            }
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
                 <Grid container spacing={0}  sx={{ height: '100%',flexWrap: 'nowrap' }  }>
                     {/* Left Pane: Message List or Compose */}
                     <Grid item md={4} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                         <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper', borderRadius: '8px 8px 0 0' }}>
                             {/* Tabs for Desktop/Tablet */}
                             <Button onClick={() => setView('inbox')} startIcon={<InboxIcon />} variant={view === 'inbox' || (view==='messageDetail' && selectedMessage?.from) ? 'contained' : 'text'}  disabled={loading}>Inbox</Button>
                             <Button onClick={() => setView('sent')} startIcon={<SendIcon />} variant={view === 'sent' || (view==='messageDetail' && selectedMessage?.to) ? 'contained' : 'text'} disabled={loading}>Sent</Button>
                             <Button onClick={() => {
                              setSelectedMessage(null); // Clear selected message when composing
                              setView('compose')}} startIcon={<CreateIcon />} variant={view === 'compose' ? 'contained' : 'text'} disabled={loading && view !=='compose'}>Compose</Button>
                         </Box>
                         <MessageListPane sx={{  flexGrow: 1, borderRight: 1, borderColor: 'divider', borderRadius: '0 0 8px 8px' }}>
                         {view === 'inbox' || view === 'sent' ? renderMessageList() : (view === 'compose' && <Typography sx={{ p: 2 }}>Yeni mesaj oluşturmak için sağdaki formu kullanın.</Typography> )}
                         </MessageListPane>
                     </Grid>
                     {/* Right Pane: Message Detail or Compose Form */}
                     <Grid item md={8} sx={{ height: '100%', display: 'flex', flexDirection: 'column'  }}>
                         <MessageContentPane sx={{
                      padding: { xs: 2, md: 4 }, // Mobilde daha dar, büyük ekranda daha geniş padding
                      maxWidth: { lg: '900px', xl: '1200px' }, // Büyük ekranlarda genişlik artırıldı
                      margin: '0 auto', // Ortalamak için
                      boxShadow: { lg: '0 4px 12px rgba(0, 0, 0, 0.1)' }, // Büyük ekranlarda gölge ekle
                      borderRadius: '12px', // Daha modern bir görünüm için yuvarlatılmış köşeler
                  }}>
                             {view === 'compose' ? renderMainContent() : (selectedMessage ? renderMessageDetails() : <Typography sx={{p: 2}}>Select a message to view.</Typography>)}
                         </MessageContentPane>
                     </Grid>
                 </Grid>
             ) : (
                 /* --- Mobile: Single View + Bottom Navigation --- */
                 <Box sx={{ height: '100%', overflowY: 'auto', paddingBottom: '56px' /* Space for bottom nav */ }}>
                     {/* Show back button if in detail view */}
                     {view === 'messageDetail' && selectedMessage && (
                         <IconButton onClick={handleBackToList} sx={{ mb: 1, mt:1, ml:1 }}>
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
                     value={view === 'messageDetail' ? (selectedMessage?.from ? 'inbox' : (selectedMessage?.to ? 'sent' : 'inbox')) : view} // Highlight correct icon even in detail view
                     onChange={(event, newValue) => {
                    if (newValue !== 'messageDetail') { // 'messageDetail' isn't a direct navigation target
                        setView(newValue);
                    }
                  }} 
                 >
                     <BottomNavigationAction label="Inbox" value="inbox" icon={<InboxIcon />} disabled={loading}  />
                     <BottomNavigationAction label="Sent" value="sent" icon={<SendIcon />}  disabled={loading} />
                     <BottomNavigationAction label="Compose" value="compose" icon={<CreateIcon />}  disabled={loading && view !=='compose'} />
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
