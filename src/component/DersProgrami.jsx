import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from "@mui/material";
import React from "react";
import './style/DersProgrami.css';
import "bootstrap/dist/css/bootstrap.min.css";

const scheduleData = [
  { day: "Pazartesi", subject: "Matematik", time: "09:00 - 10:30" },
  { day: "Pazartesi", subject: "Fizik", time: "11:00 - 12:30" },
  { day: "Salı", subject: "Kimya", time: "09:00 - 10:30" },
  { day: "Salı", subject: "İngilizce", time: "11:00 - 12:30" },
  { day: "Çarşamba", subject: "Biyoloji", time: "09:00 - 10:30" },
  { day: "Çarşamba", subject: "Tarih", time: "11:00 - 12:30" },
  { day: "Perşembe", subject: "Coğrafya", time: "09:00 - 10:30" },
  { day: "Perşembe", subject: "Resim", time: "11:00 - 12:30" },
  { day: "Cuma", subject: "Beden Eğitimi", time: "09:00 - 10:30" },
  { day: "Cuma", subject: "Bilgisayar Bilimi", time: "11:00 - 12:30" },
];

const DersProgrami = () => {

    return(<><div className="container mt-4">
      <h2 className="text-center mb-4">Öğrenci Ders Programı</h2>
      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead className="thead-dark">
            <tr>
              <th>Gün</th>
              <th>Ders</th>
              <th>Saat</th>
            </tr>
          </thead>
          <tbody>
            {scheduleData.map((item, index) => (
              <tr key={index}>
                <td>{item.day}</td>
                <td>{item.subject}</td>
                <td>{item.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div></>)
}
export default DersProgrami;