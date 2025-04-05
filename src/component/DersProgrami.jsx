import React from "react";
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { CalendarToday } from "@mui/icons-material";

const scheduleData = {
  Pazartesi: [
    { subject: "Matematik", time: "09:00 - 10:30" },
    { subject: "Fizik", time: "11:00 - 12:30" },
  ],
  Salı: [
    { subject: "Kimya", time: "09:00 - 10:30" },
    { subject: "İngilizce", time: "11:00 - 12:30" },
  ],
  Çarşamba: [
    { subject: "Biyoloji", time: "09:00 - 10:30" },
    { subject: "Tarih", time: "11:00 - 12:30" },
  ],
  Perşembe: [
    { subject: "Coğrafya", time: "09:00 - 10:30" },
    { subject: "Sanat", time: "11:00 - 12:30" },
  ],
  Cuma: [
    { subject: "Beden Eğitimi", time: "09:00 - 10:30" },
    { subject: "Bilgisayar Bilimi", time: "11:00 - 12:30" },
  ],
};

const DersProgrami = () => {
  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ color: "#007BFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <CalendarToday sx={{ mr: 1, color: "#28A745" }} /> Öğrenci Ders Programı
      </Typography>
      <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: "hidden" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#007BFF" }}>
              {Object.keys(scheduleData).map((day) => (
                <TableCell key={day} sx={{ color: "white", fontWeight: "bold" }}>{day}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {[...Array(2)].map((_, rowIndex) => (
              <TableRow key={rowIndex} hover sx={{ transition: "background-color 0.3s", '&:hover': { backgroundColor: "#FFA50033" } }}>
                {Object.keys(scheduleData).map((day) => (
                  <TableCell key={day}>
                    {scheduleData[day][rowIndex] ? (
                      <>
                        <Typography variant="body1" fontWeight="bold">{scheduleData[day][rowIndex].subject}</Typography>
                        <Typography variant="body2" color="text.secondary">{scheduleData[day][rowIndex].time}</Typography>
                      </>
                    ) : null}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};
export default DersProgrami;