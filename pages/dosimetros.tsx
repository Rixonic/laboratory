import React from 'react'
import DownloadIcon from '@mui/icons-material/Download';
import { AdminLayout } from '../components/layouts'
import IconButton from '@mui/material/IconButton';
import { CategoryOutlined } from '@mui/icons-material';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { getUserData } from '../database/dbUsers';
import { getDosimeterByLocation } from '../database/dbDosimeters';
import { Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, TablePagination } from '@mui/material';

interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'center';
  format?: (value: string) => React.JSX.Element;
}

const EquipmentsPage = (props) => {
  const dosimeters = props.dosimeter
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const onDownloadImage = (image: string) => {
    fetch(image)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        const defaultFileName = 'dosimetria.pdf';
        link.setAttribute('download', defaultFileName);
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
      });
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const columns: Column[] = [
    { id: 'headquarter', label: 'Sede', minWidth: 170 },
    { id: 'service', label: 'Servicio', minWidth: 100 },
    { id: 'location', label: 'Sector', minWidth: 100 },
    {
      id: 'month',
      label: 'Mes',
      minWidth: 70,
      align: 'center',
    },
    {
      id: 'year',
      label: 'Año',
      minWidth: 70,
      align: 'center',
    },
    {
      id: 'document',
      label: 'Descargar',
      minWidth: 70,
      align: 'center',
      format: (value: string) => (
        <IconButton
          onClick={() => onDownloadImage(value)}
        >
          <DownloadIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <AdminLayout
      title={`Dosimetria `}
      subTitle={''}
      icon={<CategoryOutlined />}
    >
      <Paper sx={{ width: '100%' }} >
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell align="center" colSpan={2}>
                  Informacion
                </TableCell>
                <TableCell align="center" colSpan={3}>
                  Periodo
                </TableCell>
                <TableCell align="center" colSpan={1}>

                </TableCell>
              </TableRow>
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
              {dosimeters
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.format && typeof value === 'string'
                              ? column.format(value)
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
          count={dosimeters.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Items por pagina"
          labelDisplayedRows={({ from, to, count }) => `Mostrando items del ${from}al ${to} de ${count} items`}
        />
      </Paper>
    </AdminLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({
  query,
  req,
}) => {

  const session = await getSession({ req });
  const userData = await getUserData(session.user.email);
  const dosimeter = await getDosimeterByLocation(userData.locations);
  delete userData._id;
  return {
    props: {
      dosimeter
    },
  };
};

export default EquipmentsPage;
