/*Anasayfa.jsx */
import React from 'react';
import { Navbar, Container, Row, Col, Card, Button, Modal } from 'react-bootstrap';
import './style/Anasayfa.css';

class Anasayfa extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false
    };
  }

  handleModalShow = () => {
    this.setState({ showModal: true });
  }

  handleModalClose = () => {
    this.setState({ showModal: false });
  }

  render() {
    return (<>
      <div className="page-transition">
        {/* Üst Menü (Navbar) */}
        <Navbar expand="lg" variant="dark" className="navbar">
          <Container>
            <Navbar.Brand>Öğrenci Takip ve Veli Bilgilendirme Sistemi</Navbar.Brand>
          </Container>
        </Navbar>

        {/* Ana İçerik */}
        <Container className="mt-4">
          <Row>
            {/* Sol Panel (Yan Menü) */}
            <Col md={3} className="sidebar">
              <Card className="mb-3">
                <Card.Body>
                  <Card.Title>Profil</Card.Title>
                  <Card.Text>Öğrenci Adı</Card.Text>
                </Card.Body>
              </Card>
              <Card className="mb-3">
                <Card.Body>
                  <Card.Title>Ders Listesi</Card.Title>
                  <Card.Text>Matematik, Fizik, Kimya...</Card.Text>
                </Card.Body>
              </Card>
              <Card className="mb-3">
                <Card.Body>
                  <Card.Title>Devamsızlık Bilgileri</Card.Title>
                 
                </Card.Body>
              </Card>
              <Card className="mb-3">
                <Card.Body>
                  <Card.Title>Disiplin Kayıtları</Card.Title>
                  <Card.Text>Matematik, Fizik, Kimya...</Card.Text>
                </Card.Body>
              </Card>
              <Card className="mb-3">
                <Card.Body>
                  <Card.Title>Sosyal Etkinlikler</Card.Title>
                  <Card.Text>Matematik, Fizik, Kimya...</Card.Text>
                </Card.Body>
              </Card>
            </Col>

            {/* Orta Bölüm (Ana İçerik Alanı) */}
            <Col md={5} className="content">
              <h2>Hoşgeldiniz, [Öğrenci Adı]!</h2>
              <Card className="mb-3 quick-summary">
                <Card.Body>
                  <p>Devamsızlık: %5</p>
                  <p>Yaklaşan Sınav: Matematik - 12 Mayıs</p>
                 
                </Card.Body>
              </Card>
              <Card className="mb-3">
                <Card.Header>Ders Programı</Card.Header>
              </Card>
              <Card className="mb-3">
                <Card.Header>Sınav Tarihleri</Card.Header>
              </Card>
              <Card className="mb-3">
                <Card.Header>Davranış Notları</Card.Header>
              </Card>
              <Card className="mb-3">
                <Card.Header>Performans Değerlendirmeleri</Card.Header>
              </Card>
            </Col>
            

            {/* Sağ Panel (Öne Çıkan Bilgiler / Bildirimler) */}
            <Col md={3} className="right-panel">
              <Card className="mb-3">
                <Card.Header>Duyurular</Card.Header>
                <Card.Body>
                  <p>Acil duyuru: Sınav takvimi güncellendi.</p>
                </Card.Body>
              </Card>
              <Button variant="primary" onClick={this.handleModalShow}>
                Mesaj Göster
              </Button>
            </Col>
          </Row>
        </Container>

        {/* Modal: Öğretmen Mesajı */}
        <Modal show={this.state.showModal} onHide={this.handleModalClose} animation={true} className="fade">
          <Modal.Header closeButton>
            <Modal.Title>Öğretmen Mesajı</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Öğrenciye özel mesaj içeriği burada yer alır.</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleModalClose}>
              Kapat
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
      </>);
  }
}

export default Anasayfa;