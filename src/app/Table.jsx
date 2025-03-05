import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import axios from "axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Box, Tab } from "@mui/material";

const CustomTable = () => {
  const [data, setData] = useState(null);

  const columns = [
    { field: "id", headerName: "ID" },
    { field: "site", headerName: "Site" },
    { field: "login", headerName: "Login" },
  ];

  useEffect(() => {
    console.log("useEffect");
    async function getData() {
      await axios.get("http://localhost:5000/get_passwords").then((res) => {
        console.log("hi");
        console.log(res);
        setData(res.data);
      });
    }

    getData();
  }, []);
  return (
    data !== null && (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Box
          sx={{
            width: "90%",
            border: "1px solid #ccc",
            borderRadius: "10px",
            borderColor: "#0096FF",
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.field}>{column.headerName}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.site}</TableCell>
                  <TableCell>{row.login}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </div>
    )
  );
};

export default CustomTable;
