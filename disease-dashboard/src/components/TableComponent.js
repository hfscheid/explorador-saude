import React, { useEffect, useState } from "react";
import { Table } from "antd";
import "antd/dist/reset.css"; // Correct path for Ant Design styles
import { fetchTableData } from "../services/fetchTableData";
import { getTables } from "../services/getTables";
import { Select, MenuItem, InputLabel, FormControl } from "@mui/material";

function TableComponent() {
  const [tableData, setTableData] = useState([]);
  const [tables, setTables] = useState([]);
  const [tableParams, setTableParams] = useState({
    table: "dengue",
    tinit: "1",
    tend: "53",
    year: 2024,
  });
  const weeks = Array.from({ length: 53 }, (_, i) => i + 1);
  const years = Array.from({ length: 7 }, (_, i) => i + 2017);

  useEffect(() => {
    const fetchTables = async () => {
      const tables = await getTables();
      setTables(tables);
    };
    fetchTables();
  }, []);

  useEffect(() => {
    fetchTableData(tableParams).then((data) => {
      if (data) {
        setTableData(data);
      }
    });
  }, [tableParams]);

  const columns = [
    {
      title: "Region",
      dataIndex: "region",
      key: "region",
    },
    {
      title: "Cases",
      dataIndex: "cases",
      key: "cases",
    },
  ];

  return (
    <div>
      <h2>Data Table</h2>
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <FormControl>
          <InputLabel>Tabela</InputLabel>
          <Select
            label="Doença"
            value={tableParams.table}
            onChange={(e) =>
              setTableParams({ ...tableParams, table: e.target.value })
            }
            renderValue={(selected) => selected}
          >
            {tables.map((table) => (
              <MenuItem key={table} value={table}>
                {table}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Select
          label="Início"
          value={tableParams.tinit}
          onChange={(e) =>
            setTableParams({ ...tableParams, tinit: e.target.value })
          }
        >
          {weeks.map((week) => (
            <MenuItem key={week} value={week}>
              {week}
            </MenuItem>
          ))}
        </Select>
        <Select
          label="Fim"
          value={tableParams.tend}
          onChange={(e) =>
            setTableParams({ ...tableParams, tend: e.target.value })
          }
        >
          {weeks.map((week) => (
            <MenuItem key={week} value={week}>
              {week}
            </MenuItem>
          ))}
        </Select>
        <Select
          label="Year"
          value={tableParams.year}
          onChange={(e) =>
            setTableParams({ ...tableParams, year: e.target.value })
          }
        >
          {years.map((year) => (
            <MenuItem key={year} value={year}            >
              {year}
            </MenuItem>
          ))}
        </Select>
      </div>
      <Table
        dataSource={tableData}
        columns={columns}
        pagination={{ pageSize: 8 }}
      />
    </div>
  );
}

export default TableComponent;
