import React, { useEffect, useState } from "react";
import { Container, Typography, Grid, TextField } from "@mui/material";
import { Bar, Doughnut } from "react-chartjs-2";
import moment from "moment";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Title,
);

const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState(moment("2023-11-01"));

  const [barData, setBarData] = useState(null);
  const [doughnutData, setDoughnutData] = useState(null);
  const [gerbangBarData, setGerbangBarData] = useState(null);
  const [cabangDoughnutData, setCabangDoughnutData] = useState(null);
  const [gerbangMappings, setGerbangMappings] = useState({});

  const fetchGerbangCabangData = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/gerbangs");
      const result = await response.json();

      if (
        result.status &&
        result.data &&
        result.data.rows &&
        result.data.rows.rows
      ) {
        const mappings = {};
        result.data.rows.rows.forEach((row) => {
          mappings[`${row.id}-${row.IdCabang}`] = {
            IdCabang: row.IdCabang,
            NamaGerbang: row.NamaGerbang,
            NamaCabang: row.NamaCabang,
          };
        });
        setGerbangMappings(mappings);
      }
    } catch (error) {
      console.error("Error fetching gerbang and cabang data:", error);
    }
  };
  const fetchData = async (tanggal) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/lalins?tanggal=${tanggal}&limit=9999`,
      );
      const result = await response.json();

      if (
        result.status &&
        result.data &&
        result.data.rows &&
        result.data.rows.rows
      ) {
        const rows = result.data.rows.rows;

        const eBriTotal = rows.reduce((sum, row) => sum + row.eBri, 0);
        const eBniTotal = rows.reduce((sum, row) => sum + row.eBni, 0);
        const eBcaTotal = rows.reduce((sum, row) => sum + row.eBca, 0);
        const eDKITotal = rows.reduce((sum, row) => sum + row.eDKI, 0);
        const eMandiriTotal = rows.reduce((sum, row) => sum + row.eMandiri, 0);
        const eMegaTotal = rows.reduce((sum, row) => sum + row.eMega, 0);
        const eFloTotal = rows.reduce((sum, row) => sum + row.eFlo, 0);

        setBarData({
          labels: ["BCA", "BRI", "BNI", "DKI", "Mandiri", "Mega", "FLO"],
          datasets: [
            {
              label: "Total Payments",
              data: [
                eBcaTotal,
                eBriTotal,
                eBniTotal,
                eDKITotal,
                eMandiriTotal,
                eMegaTotal,
                eFloTotal,
              ],
              backgroundColor: [
                "rgba(255, 99, 132, 0.6)",
                "rgba(54, 162, 235, 0.6)",
                "rgba(75, 192, 192, 0.6)",
                "rgba(153, 102, 255, 0.6)",
                "rgba(255, 159, 64, 0.6)",
              ],
              borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)",
              ],
              borderWidth: 1,
            },
          ],
        });

        const shiftCounts = {};
        rows.forEach((row) => {
          const shift = row.Shift;
          shiftCounts[shift] = (shiftCounts[shift] || 0) + 1;
        });

        const doughnutLabels = Object.entries(shiftCounts).map(
          ([shift, count]) => `Shift ${shift}`,
        );
        const doughnutDataValues = Object.values(shiftCounts);

        setDoughnutData({
          labels: doughnutLabels,
          datasets: [
            {
              label: "Number of Records by Shift",
              data: doughnutDataValues,
              backgroundColor: [
                "rgba(255, 99, 132, 0.6)",
                "rgba(54, 162, 235, 0.6)",
                "rgba(75, 192, 192, 0.6)",
                "rgba(153, 102, 255, 0.6)",
                "rgba(255, 159, 64, 0.6)",
              ],
              borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)",
              ],
              borderWidth: 1,
            },
          ],
        });

        const gerbangCabangCounts = {};
        rows.forEach((row) => {
          const key = `${row.IdGerbang}-${row.IdCabang}`;
          gerbangCabangCounts[key] = (gerbangCabangCounts[key] || 0) + 1;
        });

        const gerbangCabangLabels = Object.keys(gerbangCabangCounts).map(
          (key) => {
            const { NamaGerbang, NamaCabang } = gerbangMappings[key] || {};
            return NamaGerbang && NamaCabang ? `Gerbang ${NamaGerbang}` : key;
          },
        );
        const gerbangCabangDataValues = Object.values(gerbangCabangCounts);

        setGerbangBarData({
          labels: gerbangCabangLabels,
          datasets: [
            {
              label: "Total",
              data: gerbangCabangDataValues,
              backgroundColor: "rgba(75, 192, 192, 0.6)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        });

        const cabangCounts = {};
        rows.forEach((row) => {
          const cabang = row.IdCabang;
          cabangCounts[cabang] = (cabangCounts[cabang] || 0) + 1;
        });

        const cabangLabels = Object.keys(cabangCounts).map((cabang) => {
          console.log(Object.values(gerbangMappings));
          const cabangName = Object.values(gerbangMappings).find(
            (mapping) => mapping.IdCabang === parseInt(cabang),
          )?.NamaCabang;
          return cabangName ? `Cabang ${cabangName}` : `Cabang ${cabang}`;
        });

        console.log(Object.values(gerbangMappings));
        const cabangDataValues = Object.values(cabangCounts);

        setCabangDoughnutData({
          labels: cabangLabels,
          datasets: [
            {
              label: "Number of Records by IdCabang",
              data: cabangDataValues,
              backgroundColor: [
                "rgba(255, 99, 132, 0.6)",
                "rgba(54, 162, 235, 0.6)",
                "rgba(75, 192, 192, 0.6)",
                "rgba(153, 102, 255, 0.6)",
                "rgba(255, 159, 64, 0.6)",
              ],
              borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)",
              ],
              borderWidth: 1,
            },
          ],
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    const formattedDate = newDate.format("YYYY-MM-DD"); // Format the date with moment
    fetchData(formattedDate); // Fetch data with the new date
  };
  useEffect(() => {
    fetchGerbangCabangData();
    fetchData(selectedDate);
  }, []);

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Payment Methods Summary",
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 20,
          padding: 20,
          usePointStyle: true,
        },
      },
      title: {
        display: true,
        text: "Number of Records by Shift",
      },
    },
  };

  const gerbangBarOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Count of Records by IdGerbang",
      },
    },
  };

  const cabangDoughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        align: "start",
        labels: {
          boxWidth: 20,
          padding: 20,
          usePointStyle: true,
        },
      },
      title: {
        display: true,
        text: "Number of Records by IdCabang",
      },
    },
  };

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <Container>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        <div style={{ marginBottom: 3 }}>
          <DatePicker
            label="Select Date"
            value={selectedDate}
            onChange={handleDateChange}
            renderInput={(params) => <TextField {...params} />}
          />
        </div>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            {barData && <Bar options={barOptions} data={barData} />}
          </Grid>
          <Grid item xs={12} md={6}>
            <div style={{ width: "60%", margin: "0 auto" }}>
              {doughnutData && (
                <Doughnut options={doughnutOptions} data={doughnutData} />
              )}
            </div>
          </Grid>
          <Grid item xs={12} md={6}>
            {gerbangBarData && (
              <Bar options={gerbangBarOptions} data={gerbangBarData} />
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            <div style={{ width: "60%", margin: "0 auto" }}>
              {cabangDoughnutData && (
                <Doughnut
                  options={cabangDoughnutOptions}
                  data={cabangDoughnutData}
                />
              )}
            </div>
          </Grid>
        </Grid>
      </Container>
    </LocalizationProvider>
  );
};

export default Dashboard;
