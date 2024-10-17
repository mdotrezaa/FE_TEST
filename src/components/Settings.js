import React, { useEffect, useState } from "react";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import axios from "axios";

const Settings = () => {
  const [gerbangs, setGerbangs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredGerbangs, setFilteredGerbangs] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false); //
  const [ruas, setRuas] = useState("");
  const [gerbang, setGerbang] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [currentIdCabang, setCurrentIdCabang] = useState(null);

  const fetchGerbangs = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/gerbangs");
      const data = response.data.data.rows.rows;
      setGerbangs(data);
      setFilteredGerbangs(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchGerbangs();
  }, []);

  const handleSearch = (event) => {
    const searchValue = event.target.value.toLowerCase();
    setSearchTerm(searchValue);

    const filteredData = gerbangs.filter((gerbang) =>
      gerbang.NamaGerbang.toLowerCase().includes(searchValue),
    );
    setFilteredGerbangs(filteredData);
  };

  const handleEdit = (item) => {
    const gerbangToEdit = gerbangs.find(
      (gerbang) => gerbang.id === item.id && gerbang.IdCabang === item.IdCabang,
    );
    if (gerbangToEdit) {
      setRuas(gerbangToEdit.NamaCabang);
      setGerbang(gerbangToEdit.NamaGerbang);
      setCurrentId(item.id);
      setCurrentIdCabang(gerbangToEdit.IdCabang);
      setIsViewMode(false);
      setIsEditMode(true);
      setOpenDialog(true);
    }
  };

  const handleDelete = (item) => {
    const gerbangToEdit = gerbangs.find(
      (gerbang) => gerbang.id === item.id && gerbang.IdCabang === item.IdCabang,
    );
    if (gerbangToEdit) {
      console.log(gerbangToEdit);
      setRuas(gerbangToEdit.NamaCabang);
      setGerbang(gerbangToEdit.NamaGerbang);
      setCurrentId(item.id);
      setCurrentIdCabang(gerbangToEdit.IdCabang);
      setIsEditMode(true);
      setConfirmDeleteDialog(true);
    }
  };

  const confirmDelete = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/api/gerbangs/`,
        {
          data: {
            IdCabang: currentIdCabang,
            id: currentId,
          },
        },
      );

      if (response.data.status) {
        console.log("Updated successfully:", response.data.message);
      } else {
        console.error("Failed to update:", response.data.message);
      }
      fetchGerbangs();
    } catch (error) {
      console.error("Error deleting data:", error);
    } finally {
      setConfirmDeleteDialog(false);
    }
  };

  const handleView = (item) => {
    const gerbangToEdit = gerbangs.find(
      (gerbang) => gerbang.id === item.id && gerbang.IdCabang === item.IdCabang,
    );
    if (gerbangToEdit) {
      setRuas(gerbangToEdit.NamaCabang);
      setGerbang(gerbangToEdit.NamaGerbang);
      setCurrentId(item.id);
      setCurrentIdCabang(gerbangToEdit.IdCabang);
      setIsViewMode(true);
      setIsEditMode(false);
      setOpenDialog(true);
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setRuas("");
    setGerbang("");
    setIsEditMode(false);
    setIsViewMode(false);
    setCurrentId(null);
    setCurrentIdCabang(null);
  };

  const handleSave = async () => {
    if (!ruas || !gerbang) {
      alert("Please fill both fields");
      return;
    }

    setLoading(true);
    let inheritedIdCabang = null;

    const existingCabang = gerbangs.find((item) => item.NamaCabang === ruas);

    if (existingCabang) {
      inheritedIdCabang = existingCabang.IdCabang;
    }

    try {
      if (isEditMode) {
        const response = await axios.put(`http://localhost:8080/api/gerbangs`, {
          IdCabang: inheritedIdCabang || currentIdCabang,
          id: currentId,
          NamaCabang: ruas,
          NamaGerbang: gerbang,
        });

        if (response.data.status) {
          console.log("Updated successfully:", response.data.message);
        } else {
          console.error("Failed to update:", response.data.message);
        }
      } else {
        const existingGerbangsWithSameName = gerbangs.filter(
          (item) => item.NamaCabang === ruas,
        );

        const newGerbangId = existingGerbangsWithSameName.length + 1;

        const response = await axios.post(
          "http://localhost:8080/api/gerbangs",
          {
            IdCabang: inheritedIdCabang || 1,
            id: newGerbangId,
            NamaCabang: ruas,
            NamaGerbang: gerbang,
          },
        );

        if (response.data.status) {
          console.log("Success:", response.data.message);
        } else {
          console.error("Failed to save:", response.data.message);
        }
      }

      fetchGerbangs();
    } catch (error) {
      console.error("Error saving data:", error);
    } finally {
      setLoading(false);
      handleCloseDialog();
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <TextField
          label="Search"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearch}
          style={{ marginRight: "10px", height: "40px" }}
          size="small"
        />
        <Button
          variant="contained"
          color="primary"
          sx={{
            backgroundColor: "#3D405B",
            height: "40px",
            display: "flex",
            alignItems: "center",
          }}
          onClick={handleOpenDialog}
        >
          Tambah
        </Button>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#3D405B" }}>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                ID
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Ruas
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Nama Gerbang
              </TableCell>
              <TableCell
                sx={{ color: "#fff", fontWeight: "bold", textAlign: "center" }}
                align="center"
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredGerbangs.length > 0 ? (
              filteredGerbangs.map((gerbang, idx) => (
                <TableRow key={idx}>
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell>{gerbang.NamaCabang}</TableCell>
                  <TableCell>{gerbang.NamaGerbang}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      onClick={() => handleEdit(gerbang)}
                      color="secondary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleView(gerbang)}
                      color="primary"
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(gerbang)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No matching data found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDeleteDialog}
        onClose={() => setConfirmDeleteDialog(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this entry?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {isEditMode
            ? "Edit Gerbang"
            : isViewMode
            ? "Detail Gerbang"
            : "Tambah Gerbang"}
        </DialogTitle>
        <DialogContent>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "20px",
              marginTop: "30px",
            }}
          >
            <TextField
              label="Ruas*"
              value={ruas}
              onChange={(event) => setRuas(event.target.value)}
              fullWidth
              disabled={isViewMode}
              variant="outlined"
              style={{ marginBottom: "20px" }}
              size="small"
            />
            <TextField
              label="Gerbang*"
              value={gerbang}
              onChange={(event) => setGerbang(event.target.value)}
              disabled={isViewMode}
              fullWidth
              variant="outlined"
              style={{ marginBottom: "20px" }}
              size="small"
            />
          </div>
        </DialogContent>
        <DialogActions>
          {isViewMode ? (
            <>
              <Button
                onClick={handleCloseDialog}
                variant="contained"
                color="primary"
              >
                Tutup
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={handleCloseDialog}
                variant="outlined"
                color="primary"
              >
                Batal
              </Button>
              <Button onClick={handleSave} variant="contained" color="primary">
                {isEditMode ? "Update" : "Simpan"}
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Settings;
