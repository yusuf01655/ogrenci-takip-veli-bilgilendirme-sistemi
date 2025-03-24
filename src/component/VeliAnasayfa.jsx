// VeliAnasayfa.js
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style/VeliAnasayfa.css';
import { 
  Navbar, Nav, Container, Row, Col, 
  Card, ListGroup, Table, Button, Badge 
} from 'react-bootstrap';
import { 
  Bell, Calendar, Book, Clock, 
  Clipboard, BarChart, Mail 
} from 'react-feather';

const VeliAnasayfa = () => {
  const todaySchedule = [
    { time: '09:00', lesson: 'Matematik', teacher: 'Ahmet Yılmaz' },
    { time: '10:30', lesson: 'Fen Bilgisi', teacher: 'Ayşe Demir' },
  ];

  const assignments = [
    { title: 'Matematik Problemleri', status: 'Tamamlandı', color: 'success' },
    { title: 'Deney Raporu', status: 'Bekliyor', color: 'warning' },
  ];

  return (
    <>
      <Navbar expand="lg" className="px-4">
        <Navbar.Brand href="#home" className="text-primary fw-bold">
          Veli Portalı
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link href="#home" className="mx-3">Anasayfa</Nav.Link>
            <Nav.Link href="#messages" className="mx-3">Mesajlar</Nav.Link>
            <Nav.Link href="#profile" className="mx-3">Profil</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <Container fluid>
        <Row>
          {/* Sol Panel */}
          <Col md={3} className="sidebar">
            <div className="d-flex align-items-center mb-4">
              <div className="me-3">
                <h5>Ahmet Can</h5>
                <p className="text-muted mb-0">9-A Sınıfı</p>
              </div>
            </div>

            <Card className="mb-3">
              <Card.Body>
                <h6 className="mb-3"><BarChart size={20} className="me-2" />Genel Durum</h6>
                <div className="d-flex justify-content-between mb-2">
                  <span>Not Ortalaması</span>
                  <Badge bg="primary">84.5</Badge>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Devamsızlık</span>
                  <Badge bg="warning">2 Gün</Badge>
                </div>
              </Card.Body>
            </Card>

            <ListGroup>
              <ListGroup.Item className="d-flex align-items-center">
                <Calendar size={18} className="me-2 text-primary" />
                Etkinlik Takvimi
              </ListGroup.Item>
              <ListGroup.Item className="d-flex align-items-center">
                <Mail size={18} className="me-2 text-primary" />
                Mesaj Kutusu
              </ListGroup.Item>
            </ListGroup>
          </Col>

          {/* Ana İçerik */}
          <Col md={5} className="main-content">
            <h4 className="mb-4">Hoş Geldiniz, Sayın Veli</h4>
            
            <Card className="mb-4">
              <Card.Body>
                <h5 className="mb-3"><Clock className="me-2" />Günlük Ders Programı</h5>
                <Table hover>
                  <tbody>
                    {todaySchedule.map((item, index) => (
                      <tr key={index}>
                        <td>{item.time}</td>
                        <td>{item.lesson}</td>
                        <td>{item.teacher}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>

            <Row>
              <Col md={6}>
                <Card className="mb-4">
                  <Card.Body>
                    <h5 className="mb-3"><Book className="me-2" />Ödevler</h5>
                    {assignments.map((item, index) => (
                      <div key={index} className="d-flex justify-content-between mb-2">
                        <span>{item.title}</span>
                        <Badge bg={item.color}>{item.status}</Badge>
                      </div>
                    ))}
                  </Card.Body>
                </Card>
              </Col>
              
              <Col md={6}>
                <Card className="mb-4">
                  <Card.Body>
                    <h5 className="mb-3"><Clipboard className="me-2" />Son Sınav Sonuçları</h5>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Matematik</span>
                      <Badge bg="primary">92</Badge>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span>Fen Bilgisi</span>
                      <Badge bg="primary">85</Badge>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>

          {/* Sağ Panel */}
          <Col md={3} className="notification-panel">
            <h5 className="mb-3"><Bell className="me-2" />Bildirimler</h5>
            <ListGroup variant="flush">
              <ListGroup.Item className="d-flex align-items-center">
                <div className="me-2 text-warning">•</div>
                Yeni veli toplantısı duyurusu
              </ListGroup.Item>
              <ListGroup.Item className="d-flex align-items-center">
                <div className="me-2 text-primary">•</div>
                Matematik ödevi güncellendi
              </ListGroup.Item>
            </ListGroup>

            <div className="mt-4">
              <h5 className="mb-3">Hızlı Erişim</h5>
              <Button variant="outline-primary" className="w-100 mb-2">
                Akademik Rapor
              </Button>
              <Button variant="outline-success" className="w-100 mb-2">
                Davranış Raporu
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default VeliAnasayfa;