import { useEffect, useState } from "react";
import axios from "axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Alert from "@mui/material/Alert";
import { Box, Button, Modal, TextField } from "@mui/material";

const CustomTable = () => {
  const [data, setData] = useState(null);
  const [alertOpacity, setAlertOpacity] = useState(0);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    site: "",
    login: "",
    password: "",
  });

  const columns = [
    { field: "id", headerName: "ID" },
    { field: "site", headerName: "Site" },
    { field: "login", headerName: "Login" },
    { field: "password", headerName: "Password" },
  ];

  useEffect(() => {
    async function getData() {
      await axios.get("http://localhost:5000/get_passwords").then((res) => {
        setData(res.data);
      });
    }
    getData();
  }, []);

  const getPassword = async (site) => {
    await axios
      .get(`http://localhost:5000/get_password?site=${site}`)
      .then((res) => {
        navigator.clipboard.writeText(res.data.password);
        setAlertOpacity(1); // Плавное появление

        setTimeout(() => {
          setAlertOpacity(0); // Плавное исчезновение
        }, 3000);
      });
  };

  const handleAddPassword = async () => {
    if (!formData.site || !formData.login) return;
    await axios.post("http://localhost:5000/add_password", formData);
    setOpen(false);
    setFormData({ site: "", login: "", password: "" });
    const res = await axios.get("http://localhost:5000/get_passwords");
    setData(res.data);
    setOpen(false);
  };

  const handleButtonClick = async () => {
    setOpen(true);
  };

  return (
    data !== null && (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
          position: "relative",
        }}
      >
        {/* Alert с анимацией */}
        <Alert
          severity="success"
          sx={{
            position: "absolute",
            top: "10px",
            opacity: alertOpacity,
            transition: "opacity 0.5s ease-in-out",
            display: alertOpacity == 1 ? "flex" : "none",
            width: "60%",
            zIndex: 10, // Поверх таблицы
          }}
        >
          Пароль скопирован в буфер обмена!
        </Alert>

        <Button
          variant="contained"
          onClick={handleButtonClick}
          sx={{ zIndex: 1, marginTop: "20px" }}
        >
          Добавить пароль
        </Button>

        <Box
          sx={{
            width: "90%",
            border: "1px solid #ccc",
            borderRadius: "10px",
            borderColor: "#0096FF",
            marginTop: "20px",
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ textAlign: "center", justifyContent: "center" }}>
                {columns.map((column) => (
                  <TableCell
                    key={column.field}
                    sx={{ textAlign: "center", justifyContent: "center" }}
                  >
                    {column.headerName}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.id}>
                  <TableCell
                    sx={{ textAlign: "center", justifyContent: "center" }}
                  >
                    {row.id}
                  </TableCell>
                  <TableCell
                    sx={{ textAlign: "center", justifyContent: "center" }}
                  >
                    {row.site}
                  </TableCell>
                  <TableCell
                    sx={{ textAlign: "center", justifyContent: "center" }}
                  >
                    {row.login}
                  </TableCell>
                  <TableCell
                    onClick={() => getPassword(row.site)}
                    sx={{
                      textAlign: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                  >
                    {row.password}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>

        <Modal open={open} onClose={() => setOpen(false)}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              p: 4,
              borderRadius: 2,
              boxShadow: 24,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <TextField
              label="Сайт"
              variant="outlined"
              value={formData.site}
              onChange={(e) =>
                setFormData({ ...formData, site: e.target.value })
              }
            />
            <TextField
              label="Логин"
              variant="outlined"
              value={formData.login}
              onChange={(e) =>
                setFormData({ ...formData, login: e.target.value })
              }
            />
            <TextField
              label="Пароль"
              type="password"
              variant="outlined"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddPassword}
            >
              Добавить
            </Button>
          </Box>
        </Modal>
      </div>
    )
  );
};

export default CustomTable;
