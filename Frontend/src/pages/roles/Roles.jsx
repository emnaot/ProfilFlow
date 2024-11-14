import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsIcon from '@mui/icons-material/Settings';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const DataGridDemo = () => {
  const [rows, setRows] = React.useState([]);
  const [newRole, setNewRole] = React.useState("");

  React.useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch("https://localhost:45455/api/Roles");
        const roles = await response.json();
        setRows(roles);
      } catch (error) {
        console.error("Erreur lors de la récupération des rôles:", error);
      }
    };

    fetchRoles();
  }, []);

  const handleAddRole = async () => {
    if (newRole.trim() !== "") {
      try {
        const response = await fetch("https://localhost:45455/api/Roles", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ roles: newRole }),
        });
        const addedRole = await response.json();
        setRows((prevRows) => [...prevRows, addedRole]);
        setNewRole("");
      } catch (error) {
        console.error("Erreur lors de l'ajout du rôle:", error);
      }
    }
  };

  const handleDeleteRole = async (id) => {
    try {
      await fetch(`https://localhost:45455/api/Roles/${id}`, {
        method: "DELETE",
      });
      setRows((prevRows) => prevRows.filter((row) => row.id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression du rôle:", error);
    }
  };

  const handleSettingsClick = (id) => {
    alert("Paramètres pour " + id);
  };

  const columns = [
    { field: "roles", headerName: "Rôle", flex: 1 },
    {
      field: "actions",
      headerName: "Action",
      flex: 1,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => alert("Modifier " + params.id)} color="primary">
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDeleteRole(params.id)} color="secondary">
            <DeleteIcon />
          </IconButton>
          <IconButton onClick={() => handleSettingsClick(params.id)} color="default">
            <SettingsIcon />
          </IconButton>
        </>
      ),
      sortable: false,
      filterable: false,
    },
  ];

  return (
    <Box sx={{ width: "100%", maxWidth: "100%", margin: "20px" }}>
      <Box sx={{ display: "flex", gap: 2, marginBottom: 2 }}>
        <TextField
          label="Nouveau Rôle"
          variant="outlined"
          value={newRole}
          onChange={(e) => setNewRole(e.target.value)}
          fullWidth
        />
        <Button variant="contained" color="primary" onClick={handleAddRole}>
          Ajouter
        </Button>
      </Box>
      <Box sx={{ height: 400, backgroundColor: "white", color: "black" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          checkboxSelection
          disableSelectionOnClick
          autoHeight
        />
      </Box>
    </Box>
  );
};

export default DataGridDemo;
