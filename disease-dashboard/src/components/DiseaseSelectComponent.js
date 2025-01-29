import React from "react";
import {
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
} from "@mui/material";

const DiseaseSelect = ({
  params,
  setParams,
  multiSelect = true,
  menuItems = false,
}) => {
  return (
    <FormControl>
      <InputLabel>Doença</InputLabel>
      <Select
        multiple={multiSelect} // Make multi-select optional
        value={multiSelect ? params.table : params.table[0] || ""} // Handle single select
        onChange={(e) =>
          setParams({
            ...params,
            table: multiSelect ? e.target.value : [e.target.value], // Ensure consistent data structure
          })
        }
        renderValue={
          (selected) => (multiSelect ? selected.join(", ") : selected) // Render appropriately based on `multiSelect`
        }
      >
        {menuItems ? (
          menuItems.map((table) => (
            <MenuItem key={table} value={table}>
              <Checkbox checked={params.table.indexOf(table) > -1} />
              <ListItemText primary={table} />
            </MenuItem>
          ))
        ) : (
          <>
            <MenuItem key={"dengue"} value="dengue">
              {multiSelect && (
                <Checkbox checked={params.table.indexOf("dengue") > -1} />
              )}
              <ListItemText primary="Dengue" />
            </MenuItem>
            <MenuItem key={"chikungunya"} value="chikungunya">
              {multiSelect && (
                <Checkbox checked={params.table.indexOf("chikungunya") > -1} />
              )}
              <ListItemText primary="Chikungunya" />
            </MenuItem>
            <MenuItem key={"zika"} value="zika">
              {multiSelect && (
                <Checkbox checked={params.table.indexOf("zika") > -1} />
              )}
              <ListItemText primary="Zika" />
            </MenuItem>
          </>
        )}
      </Select>
    </FormControl>
  );
};

export default DiseaseSelect;
