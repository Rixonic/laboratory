import React, { useState, useEffect } from 'react'
import { Stack, Collapse, Table, TableBody, TableCell, TableHead, TableRow, Paper, TableContainer } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { AdminLayout } from '../../components/layouts';
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import IconButton from '@mui/material/IconButton';
import { IEquipment } from '../../interfaces';
import axios from 'axios';

const rowWidth = [10, 100, 100, 100, 100, 100, 100]

const Row = ({ row }) => {
  const [open, setOpen] = useState(false);

  const handleRowToggle = () => {
    setOpen(!open);
  };

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }} >
        <TableCell width={rowWidth[0]}>
          {row.associatedEquip.length > 0 && (
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={handleRowToggle}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          )}
        </TableCell>
        <TableCell width={rowWidth[1]} component="th" scope="row">{row.equipId}</TableCell>
        <TableCell width={rowWidth[2]} align="right">{row.equip}</TableCell>
        <TableCell width={rowWidth[3]} align="right">{row.model}</TableCell>
        <TableCell width={rowWidth[4]} align="right">{row.brand}</TableCell>
        <TableCell width={rowWidth[5]} align="right">{row.serialNumber}</TableCell>
        <TableCell width={rowWidth[6]} align="right">
          <Stack direction="row">
            <IconButton href={`/admin/equipments/${row.equipId}`}><EditIcon /></IconButton>
            <IconButton href={`/equipment/${row.equipId}`}><VisibilityIcon /></IconButton>
          </Stack>
        </TableCell>
      </TableRow>
      {row.associatedEquip.length > 0 && (
        <TableRow sx={{ '& > *': { borderBottom: 0 } }}>
          <TableCell style={{ paddingBottom: 1, paddingTop: 0, paddingRight:0, paddingLeft:0 }} colSpan={7}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Table aria-label="collapsible table">
                <TableBody>
                  {row.associatedEquip.map((associatedRow) => (
                    <Row key={associatedRow.equipId} row={associatedRow} />
                  ))}
                </TableBody>
              </Table>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

const EquipmentsPage = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/admin/equipments');
        setData(response.data);
      } catch (err) {
        console.log(err)
      }
    };
    fetchData();
  }, []);

  return (
    <AdminLayout
      title={`Equipamiento `}
      subTitle={'Listado de equipamiento'}
    >
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell width={rowWidth[0]} />
              <TableCell width={rowWidth[1]} >Dessert (100g serving)</TableCell>
              <TableCell width={rowWidth[2]} align="right">Calories</TableCell>
              <TableCell width={rowWidth[3]} align="right">Fat&nbsp;(g)</TableCell>
              <TableCell width={rowWidth[4]} align="right">Carbs&nbsp;(g)</TableCell>
              <TableCell width={rowWidth[5]} align="right">Protein&nbsp;(g)</TableCell>
              <TableCell width={rowWidth[6]} align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
              {data.map((row) => (
              <Row key={row.name} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </AdminLayout>
  )
}

export default EquipmentsPage;