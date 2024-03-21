import React, { useState, useEffect} from 'react'
import { AdminLayout } from '../components/layouts'
import { format } from 'date-fns';
import { IEquipmentService  } from '../interfaces';
import axios from 'axios';
import { CategoryOutlined } from '@mui/icons-material';

const rowWidth = [10, 100, 100, 100, 100, 100, 100]
const currentDate = new Date();

const Row = ({ row }) => {
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
  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }} >
        <TableCell width={rowWidth[1]} align='center'>{row.ownId}</TableCell>
        <TableCell width={rowWidth[2]} align="left">{row.equip}</TableCell>
        <TableCell width={rowWidth[3]} align="center">{row.model}</TableCell>
        <TableCell width={rowWidth[4]} align="center">{row.brand}</TableCell>
        <TableCell width={rowWidth[5]} align="center">{row.serialNumber}</TableCell>
        <TableCell width={rowWidth[5]} align="center">{row.service}</TableCell>
        <TableCell width={rowWidth[3]} align="center">{row.perfomance}</TableCell>
        <TableCell width={rowWidth[4]} align="center">{row.duePerfomance && <Chip label={format(new Date(row.duePerfomance), 'MM/yyyy').toString()} color={classNamePerformance} />}</TableCell>
        <TableCell width={rowWidth[5]} align="center">{row.electricalSecurity}</TableCell>
        <TableCell width={rowWidth[5]} align="center">{row.dueElectricalSecurity && <Chip label={format(new Date(row.dueElectricalSecurity), 'MM/yyyy').toString()} color={classNameElectricalSecurity} />}</TableCell>

      </TableRow>
      {row.associatedEquip?.length > 0 && (
        <TableRow sx={{ '& > *': { borderBottom: 0 } }}>
          <TableCell style={{ paddingBottom: 1, paddingTop: 0, paddingRight:0, paddingLeft:0 }} colSpan={10}>
              <Table aria-label="collapsible table">
                <TableBody>
                  {row.associatedEquip?.map((associatedRow) => (
                    <Row key={associatedRow.equipId} row={associatedRow} />
                  ))}
                </TableBody>
              </Table>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { getUserData } from '../database/dbUsers';
import { TableRow, TableCell, Chip, Table, TableBody, TableContainer, Paper, TableHead, TablePagination } from '@mui/material';

const EquipmentsPage = (props) =>  { 
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const userData = props.userData;
  const [filteredEquips, setFilteredEquips] = useState<IEquipmentService[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/admin/equipmentsService', {
          params: {
            locations: userData.locations,
            sede: userData.sede
          }
        });
        const formattedData = response.data.map(equipment => {
          const parsedEquipment = {
            ...equipment,
            perfomance: equipment.perfomance ? format(new Date(equipment.perfomance), 'MM/yyyy') : null,
            duePerfomance: equipment.duePerfomance ? new Date(equipment.duePerfomance) : null,
            electricalSecurity: equipment.electricalSecurity ? format(new Date(equipment.electricalSecurity), 'MM/yyyy') : null,
            dueElectricalSecurity: equipment.dueElectricalSecurity ? new Date(equipment.dueElectricalSecurity) : null,
          };
          return parsedEquipment;
        });
        if(userData.role == "COORDINADOR CASTELAR"){
          const filtered = formattedData.filter((equip) => userData.locations.includes(equip.service.toLowerCase())  || equip.sede == "CASTELAR").sort((a, b) => a.ownId - b.ownId);
          setFilteredEquips(filtered);
        }else {
          const filtered = formattedData.filter((equip) => userData.locations.includes(equip.service.toLowerCase())).sort((a, b) => a.ownId - b.ownId);
          setFilteredEquips(filtered);
        }

      } catch (err) {
        console.log(err); 
      }
    };
    fetchData();
  }, []);

  return (
    <AdminLayout 
        title={`Equipamiento `} 
        subTitle={'Listado de equipamiento'}
        icon={ <CategoryOutlined /> }
    >
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
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
            </TableRow>
          </TableHead>
          <TableBody>
              {filteredEquips.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
              <Row key={row._id} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredEquips.length}
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

export const getServerSideProps: GetServerSideProps = async ({
  query,
  req,
}) => {

  const session = await getSession({ req });
  const userData = await getUserData(session.user.email);

  delete userData._id;
  
  return {
    props: {
      userData
    },
  };
};


export default EquipmentsPage;