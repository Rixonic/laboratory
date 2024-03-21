import React, { useState, useEffect } from 'react'
import { Stack, Collapse, Table, TableBody, TableCell, TableHead, TableRow, Paper, TableContainer, TablePagination, Chip } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { AdminLayout } from '../../components/layouts';
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import IconButton from '@mui/material/IconButton';
import axios from 'axios';

const rowWidth = [10, 100, 100, 100, 100, 100, 100]

const currentDate = new Date();

const Row = ({ row }) => {
  const [open, setOpen] = useState(false);

  const dueDateElectricalSecurity = new Date(row.dueElectricalSecurity);
  const daysDifferenceElectricalSecurity = Math.floor(
    (dueDateElectricalSecurity.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  let classNameElectricalSecurity : 'success'|'warning'|'error';
  if (daysDifferenceElectricalSecurity <= -60 && row.duePerfomance) {
    classNameElectricalSecurity = 'error';
  } else if (daysDifferenceElectricalSecurity >= -60 && daysDifferenceElectricalSecurity <= 60) {
    classNameElectricalSecurity = 'warning';
  } else if (daysDifferenceElectricalSecurity >= 60) {
    classNameElectricalSecurity = 'success';
  }

  const dueDatePerfomance = new Date(row.duePerfomance);
  const daysDifferencePerfomance = Math.floor(
    (dueDatePerfomance.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  let classNamePerformance : 'success'|'warning'|'error';
  if (daysDifferencePerfomance <= -60 && row.duePerfomance) {
    classNamePerformance = 'error';
  } else if (daysDifferencePerfomance >= -60 && daysDifferencePerfomance <= 60) {
    classNamePerformance = 'warning';
  } else if (daysDifferencePerfomance >= 60) {
    classNamePerformance = 'success';
  }

  const handleRowToggle = () => {
    setOpen(!open);
  };

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }} >
        <TableCell width={rowWidth[0]} align='center'>
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
        <TableCell width={rowWidth[1]} align='center'>{row.equipId}</TableCell>
        <TableCell width={rowWidth[2]} align="left">{row.equip}</TableCell>
        <TableCell width={rowWidth[3]} align="center">{row.model}</TableCell>
        <TableCell width={rowWidth[4]} align="center">{row.brand}</TableCell>
        <TableCell width={rowWidth[5]} align="center">{row.serialNumber}</TableCell>
        <TableCell width={rowWidth[5]} align="center">{row.sector}</TableCell>
        <TableCell width={rowWidth[3]} align="center">{row.perfomance}</TableCell>
        <TableCell width={rowWidth[4]} align="center">{row.duePerfomance && <Chip label={row.duePerfomance} color={classNamePerformance} />}</TableCell>
        <TableCell width={rowWidth[5]} align="center">{row.electricalSecurity}</TableCell>
        <TableCell width={rowWidth[5]} align="center">{row.dueElectricalSecurity && <Chip label={row.dueElectricalSecurity} color={classNameElectricalSecurity} />}</TableCell>
        <TableCell width={rowWidth[6]} align="center">
          <Stack direction="row">
            <IconButton href={`/admin/equipments/${row.equipId}`}><EditIcon /></IconButton>
            <IconButton href={`/equipment/${row.equipId}`}><VisibilityIcon /></IconButton>
          </Stack>
        </TableCell>
      </TableRow>
      {row.associatedEquip.length > 0 && (
        <TableRow sx={{ '& > *': { borderBottom: 0 } }}>
          <TableCell style={{ paddingBottom: 1, paddingTop: 0, paddingRight:0, paddingLeft:0 }} colSpan={12}>
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
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

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

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <AdminLayout
      title={`Equipamiento `}
      subTitle={'Listado de equipamiento'}
    >
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell width={rowWidth[0]} align='center'/>
              <TableCell width={rowWidth[1]} align='center'>ID</TableCell>
              <TableCell width={rowWidth[2]} align='center'>Equipo</TableCell>
              <TableCell width={rowWidth[3]} align='center'>Modelo</TableCell>
              <TableCell width={rowWidth[4]} align='center'>Marca</TableCell>
              <TableCell width={rowWidth[5]} align='center'>Serie</TableCell>
              <TableCell width={rowWidth[6]} align='center'>Sector</TableCell>
              <TableCell width={rowWidth[3]} align='center'>Performance</TableCell>
              <TableCell width={rowWidth[4]} align='center'>Proxima asistencia</TableCell>
              <TableCell width={rowWidth[5]} align='center'>Seguridad electrica</TableCell>
              <TableCell width={rowWidth[6]} align='center'>Proxima asistencia</TableCell>
              <TableCell width={rowWidth[6]} align='center'>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
              {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
              <Row key={row.name} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Equipos por pagina"
          labelDisplayedRows={({ from, to, count }) => `Mostrando equipos del ${from} al ${to} de ${count}`}
        />
    </AdminLayout>
  )
}

export default EquipmentsPage;