import React from 'react'
import { NextPage, GetServerSideProps, GetStaticPaths, GetStaticProps } from 'next';    //Queda
import { useRouter } from 'next/router';       
import { Box, Button, Chip, Grid, Typography, Divider, IconButton, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material';                    //Queda
import { ShopLayout } from '../../components/layouts';                                  //Queda
import { ItemSlideshow } from '../../components/item';
import VisibilityIcon from "@mui/icons-material/Visibility";
import { dbEquipments, dbTickets } from '../../database';                                            //Se modifica?
import { IEquipment, ITicket } from '../../interfaces';                       //Se modifica
import { format } from 'date-fns';
interface Props {
  equipment: IEquipment
  tickets: ITicket[]
}

interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'center';
  format?: (row: ITicket) => React.JSX.Element;
}  

const columns: Column[] = [
  { id: 'ticketId', label: 'Ticket ID', minWidth: 170 },
  {
    id: 'createdAt',
    label: 'Creado: ',
    minWidth: 70,
    align: 'center',
    format: (row: ITicket) => (<>{format(new Date(row.createdAt), "dd/MM/yyyy HH:mm")}</>)
    ,
  },
  { id: 'user', label: 'Solicitante', minWidth: 100 },
  { id: 'summary', label: 'Descripcion', minWidth: 100 },
  {
    id: 'status',
    label: 'Estado',
    minWidth: 70,
    align: 'center',
    format: (row: ITicket) => (<Chip label={row.status} color={row.status.toUpperCase()=="FINALIZADO"?"success":"warning"} variant="filled" />)
    ,
  },
  { id: 'location', label: 'Servicio', minWidth: 100 },
  {
    id: 'actions',
    label: 'Acciones',
    minWidth: 70,
    align: 'center',
    format: (row: ITicket) => (
      <Stack direction="row">
      <IconButton href={`/ticket/${row.ticketId}`}>
        <VisibilityIcon />
      </IconButton>
    </Stack>
    ),
  },
];


const EquipmentPage:NextPage<Props> = ({ equipment, tickets }) => {

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const router = useRouter();
  console.log(tickets);
  return (
    <ShopLayout title={ equipment.equip } pageDescription={ equipment.equipId }>
    
      <Grid container spacing={3}>

      <Typography variant='h1' component='h1'>{ 'Equipo' }</Typography>

        <Grid item xs={ 12 } sm={ 5 }>
          <Box display='flex' flexDirection='column' >

            {/* titulos */}
            <Typography variant='subtitle2' component='h2'>{ `Equipo` }</Typography>
            <Typography variant='h1' component='h1'>{ equipment.equip}</Typography>
            <Divider />
            <Typography variant='subtitle2' component='h2'>{ `Marca` }</Typography>
            <Typography variant='h1' component='h1'>{ equipment.brand }</Typography>
            <Divider />
            <Typography variant='subtitle2' component='h2'>{ `Modelo` }</Typography>
            <Typography variant='h1' component='h1'>{ equipment.model }</Typography>
            <Divider />
            <Typography variant='subtitle2' component='h2'>{ `Serie` }</Typography>
            <Typography variant='h1' component='h1'>{ equipment.serialNumber }</Typography>
            <Divider />
            <Typography variant='subtitle2' component='h2'>{ `Ubicacion` }</Typography>
            <Typography variant='h1' component='h1'>{ equipment.location }</Typography>



          </Box>
        </Grid>


            <Grid item xs={12} sm={ 7 }>
            {equipment.images && equipment.images.length > 0 ? (
  <ItemSlideshow images={equipment.images} />
) : (
  <Typography variant='subtitle2' component='h2'>No hay imagenes asociadas</Typography>
)}

          </Grid>


          <Grid item xs={12}>
    <Typography variant="h2">Tickets Asociados</Typography>

  </Grid>
  <Grid item xs={12} sx={{ height:650, width: '100%' }}>

  <Paper sx={{ width: '100%' }} >
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ top: 57, minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {tickets
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row._id}>
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.format 
                              ? column.format(row)
                              : value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={tickets.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Items por pagina"
          labelDisplayedRows={({ from, to, count }) => `Mostrando items del ${from}al ${to} de ${count} items`}
        />
      </Paper>

            </Grid>

      </Grid>

    </ShopLayout>
  )
}


export const getStaticPaths: GetStaticPaths = async (ctx) => {
  
  const equipmentEquips = await dbEquipments.getAllEquipments();
  //equipmentEquips.push({equipId:'1A'})
  //console.log(equipmentEquips)

  return {
    paths: equipmentEquips.map( ({ equipId }) => ({  
      params: {
        equipId                                   
      }
    })),
    fallback: 'blocking'
  }
}

export const getStaticProps: GetServerSideProps = async ({ params }) => {
  
  const { equipId  = '' } = params as { equipId : string }; 
  const equipment = await dbEquipments.getEquipmentByEquipId( equipId );

  //const equipment = await dbEquipments.getEquipmentBySubEquipId( equipId );

  if ( !equipment  ) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  const tickets = await dbTickets.getTicketsByEquipmentId(equipment.equipId);

  return {
    props: {
      equipment,
      tickets,
    },
    revalidate: 60 * 60 * 24
  }
}


export default EquipmentPage