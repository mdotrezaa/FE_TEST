import React, { useEffect, useState } from "react";
import Moment from "react-moment";
import "moment/locale/id";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TableFooter,
  Tabs,
  Tab,
  TextField,
  Button,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";

const paymentMethods = [
  {
    id: "ktp",
    label: "Total KTP",
    name: "KTP",
    methods: ["dinaskary", "dinasmitra", "dinasopr"],
  },
  {
    id: "etoll",
    label: "Total E-Toll",
    name: "E-Toll",
    methods: ["ebca", "ebni", "ebri", "edki"],
  },
  {
    id: "flo",
    label: "Total Flo",
    name: "Flo",
    methods: ["emandi", "emege", "enobu", "eflo"],
  },
  { id: "tunai", label: "Total Tunai", name: "Tunai", methods: ["Tunai"] },
  {
    id: "total",
    label: "Total Keseluruhan",
    name: "Keseluruhan",
    methods: ["Tunai"],
  },
  {
    id: "flo_tunai_etoll",
    label: "Total E-Toll + Tunai + Flo",
    name: "E-Toll + Tunai + FloFlo",
    methods: ["Tunai"],
  },
];

const Reports = () => {
  const [reportsData, setReportsData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedTab, setSelectedTab] = useState("ktp");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  const fetchBranchData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/gerbangs");
      return response.data.data.rows.rows;
    } catch (error) {
      console.error("Error fetching branch data: ", error);
      return [];
    }
  };

  const fetchData = async (page, limit, tabs) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/lalins?page=1&limit=99999`,
      );
      if (response.data.status) {
        const rows = response.data.data.rows.rows;
        const branchData = await fetchBranchData();

        const branchMap = {};
        branchData.forEach((item) => {
          branchMap[`${item.id}-${item.IdCabang}`] = {
            IdCabang: item.IdCabang,
            NamaGerbang: item.NamaGerbang,
            NamaCabang: item.NamaCabang,
          };
        });

        const groupedData = rows.reduce((acc, item) => {
          const key = `${item.IdCabang}-${item.IdGerbang}-${item.IdGardu}-${item.Tanggal}`;
          if (!acc[key]) {
            acc[key] = {
              IdCabang: item.IdCabang,
              IdGerbang: item.IdGerbang,
              IdGardu: item.IdGardu,
              Tanggal: item.Tanggal,
              items: [],
              summary: {},
              NamaGerbang:
                branchMap[`${item.IdGerbang}-${item.IdCabang}`]?.NamaGerbang ||
                "",
              NamaCabang:
                branchMap[`${item.IdGerbang}-${item.IdCabang}`]?.NamaCabang ||
                "",
            };
          }
          acc[key].items.push(item);
          const golonganKey = item.Golongan;

          if (!acc[key].summary[golonganKey]) {
            acc[key].summary[golonganKey] = {
              Golongan: golonganKey,
              Tunai: 0,
              DinasOpr: 0,
              DinasMitra: 0,
              DinasKary: 0,
              eMandiri: 0,
              eBri: 0,
              eBni: 0,
              eBca: 0,
              eNobu: 0,
              eDKI: 0,
              eMega: 0,
              eFlo: 0,
            };
          }

          acc[key].summary[golonganKey].Tunai += item.Tunai;
          acc[key].summary[golonganKey].DinasOpr += item.DinasOpr;
          acc[key].summary[golonganKey].DinasMitra += item.DinasMitra;
          acc[key].summary[golonganKey].DinasKary += item.DinasKary;
          acc[key].summary[golonganKey].eMandiri += item.eMandiri;
          acc[key].summary[golonganKey].eBri += item.eBri;
          acc[key].summary[golonganKey].eBni += item.eBni;
          acc[key].summary[golonganKey].eBca += item.eBca;
          acc[key].summary[golonganKey].eNobu += item.eNobu;
          acc[key].summary[golonganKey].eDKI += item.eDKI;
          acc[key].summary[golonganKey].eMega += item.eMega;
          acc[key].summary[golonganKey].eFlo += item.eFlo;
          return acc;
        }, {});

        const groupedArray = Object.values(groupedData);

        const summarizedData = groupedArray.map((group) => {
          const summaryArray = Object.values(group.summary);
          const summaryObject = summaryArray.reduce((acc, item) => {
            if (tabs === "ktp") {
              acc[`Golongan_${item.Golongan}`] = {
                item,
                value: item.DinasKary + item.DinasMitra + item.DinasOpr,
              };
            } else if (tabs === "etoll") {
              acc[`Golongan_${item.Golongan}`] = {
                item,
                value:
                  item.eMandiri +
                  item.eBri +
                  item.eBni +
                  item.eBca +
                  item.eNobu +
                  item.eDKI +
                  item.eMega,
              };
            } else if (tabs === "tunai") {
              acc[`Golongan_${item.Golongan}`] = { item, value: item.Tunai };
            } else if (tabs === "flo") {
              acc[`Golongan_${item.Golongan}`] = { item, value: item.eFlo };
            } else if (tabs === "flo_tunai_etoll") {
              acc[`Golongan_${item.Golongan}`] = {
                item,
                value:
                  item.Tunai +
                  item.eFlo +
                  item.eMandiri +
                  item.eBri +
                  item.eBni +
                  item.eBca +
                  item.eNobu +
                  item.eDKI +
                  item.eMega,
              };
            } else {
              acc[`Golongan_${item.Golongan}`] = {
                item,
                value:
                  item.Tunai +
                  item.DinasKary +
                  item.DinasMitra +
                  item.DinasOpr +
                  item.eMandiri +
                  item.eBri +
                  item.eBni +
                  item.eBca +
                  item.eNobu +
                  item.eDKI +
                  item.eMega +
                  item.eFlo,
              };
            }
            return acc;
          }, {});

          for (let i = 1; i <= 5; i++) {
            if (!summaryObject[`Golongan_${i}`]) {
              summaryObject[`Golongan_${i}`] = {
                item: { Golongan: i },
                value: 0,
              };
            }
          }

          return {
            IdCabang: group.IdCabang,
            IdGerbang: group.IdGerbang,
            IdGardu: group.IdGardu,
            Tanggal: group.Tanggal,
            NamaGerbang: group.NamaGerbang,
            NamaCabang: group.NamaCabang,
            ...summaryObject,
          };
        });

        setReportsData(summarizedData);
        setFilteredData(summarizedData);
      } else {
        console.error("Failed to fetch data: ", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchData(currentPage, rowsPerPage, selectedTab);
  }, [currentPage, rowsPerPage, selectedTab]);

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    setCurrentPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const getPaymentMethodLabel = (tab) => {
    const method = paymentMethods.find((method) => method.id === tab);
    return method ? method.name : "";
  };

  const handleSearchClick = () => {
    const searchLower = searchTerm.toLowerCase();
    const newFilteredData = reportsData.filter((row) => {
      const matchesSearch =
        row.NamaCabang.toLowerCase().includes(searchLower) ||
        row.NamaGerbang.toLowerCase().includes(searchLower);

      const matchesDate =
        !selectedDate ||
        new Date(row.Tanggal).toDateString() ===
          new Date(selectedDate).toDateString();

      return matchesSearch && matchesDate;
    });
    setFilteredData(newFilteredData);
    setCurrentPage(0);
  };

  const paginatedData = filteredData.slice(
    currentPage * rowsPerPage,
    currentPage * rowsPerPage + rowsPerPage,
  );

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Typography variant="h6" gutterBottom>
          Laporan Lalin Per Hari
        </Typography>

        <div
          style={{
            display: "flex",
            gap: "16px",
            alignItems: "center",
            width: "450px",
          }}
        >
          <TextField
            label="Search"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search by branch name or gate name"
          />

          <DatePicker
            label="Select Date"
            value={selectedDate}
            onChange={(newValue) => setSelectedDate(newValue)}
            renderInput={(params) => <TextField {...params} />}
          />
        </div>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSearchClick}
          sx={{ my: 1, backgroundColor: "#3D405B" }}
        >
          Search
        </Button>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          TabIndicatorProps={{
            style: {
              backgroundColor: "transparent",
            },
          }}
        >
          {paymentMethods.map((method) => (
            <Tab
              key={method.id}
              value={method.id}
              label={method.label}
              sx={{
                backgroundColor:
                  selectedTab === method.id ? "#3D405B" : "#e0e0e0",
                color: selectedTab === method.id ? "#fff!important" : "#000",
                borderRadius: "5px",
                my: 1,
                marginRight: 1,
                "&:hover": {
                  backgroundColor:
                    selectedTab === method.id ? "#3D405B" : "#bdbdbd",
                  color: selectedTab === method.id ? "#fff" : "#000",
                },
              }}
            />
          ))}
        </Tabs>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#3D405B" }}>
                <TableCell
                  sx={{
                    color: "#fff",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  No
                </TableCell>
                <TableCell
                  sx={{
                    color: "#fff",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Ruas
                </TableCell>
                <TableCell
                  sx={{
                    color: "#fff",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Gerbang
                </TableCell>
                <TableCell
                  sx={{
                    color: "#fff",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Gardu
                </TableCell>
                <TableCell
                  sx={{
                    color: "#fff",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Hari
                </TableCell>
                <TableCell
                  sx={{
                    color: "#fff",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Tanggal
                </TableCell>
                <TableCell
                  sx={{
                    color: "#fff",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Metode Pembayaran
                </TableCell>
                <TableCell
                  sx={{
                    color: "#fff",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Gol I
                </TableCell>
                <TableCell
                  sx={{
                    color: "#fff",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Gol II
                </TableCell>
                <TableCell
                  sx={{
                    color: "#fff",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Gol III
                </TableCell>
                <TableCell
                  sx={{
                    color: "#fff",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Gol IV
                </TableCell>
                <TableCell
                  sx={{
                    color: "#fff",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Gol V
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.map((row, idx) => (
                <TableRow key={idx}>
                  <TableCell>{currentPage * rowsPerPage + idx + 1}</TableCell>
                  <TableCell>{row.NamaCabang}</TableCell>
                  <TableCell>{row.NamaGerbang}</TableCell>
                  <TableCell>{row.IdGardu}</TableCell>
                  <TableCell>
                    <Moment format="dddd" locale="id">
                      {row.Tanggal}
                    </Moment>
                  </TableCell>
                  <TableCell>
                    <Moment format="DD/MM/YYYY" locale="id">
                      {row.Tanggal}
                    </Moment>
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {getPaymentMethodLabel(selectedTab)}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {row.Golongan_1.value}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {row.Golongan_2.value}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {row.Golongan_3.value}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {row.Golongan_4.value}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {row.Golongan_5.value}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[10, 25, 50]}
                  count={filteredData.length}
                  rowsPerPage={rowsPerPage}
                  page={currentPage}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Paper>
    </LocalizationProvider>
  );
};

export default Reports;
