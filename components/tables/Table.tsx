import React,{ FC } from 'react';

import { Paper, TableContainer, TableHead, TableRow, TableCell, TableBody, TablePagination, Table as Tables } from '@mui/material';

export interface Column {
    id: string;
    label: string;
    minWidth?: number;
    align?: 'center';
    format?: (value: string) => React.JSX.Element;
  }

interface Props {
    columns: Column[]; 
    data: any[];
}

export const CustomTable: FC<Props> = ({ columns,data }) => {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
      };
    
      const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
      };
      
  return (
    <Paper sx={{ width: "auto" }} >
    <TableContainer sx={{ maxHeight: 440 }}>
      <Tables aria-label="sticky table">
        <TableHead>
          {/*<TableRow>
            <TableCell align="center" colSpan={2}>
              Informacion
            </TableCell>
            <TableCell align="center" colSpan={3}>
              Periodo
            </TableCell>
            <TableCell align="center" colSpan={1}>

            </TableCell>
          </TableRow>*/}
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
          {data
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((row) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
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
      </Tables>
    </TableContainer>
    <TablePagination
      rowsPerPageOptions={[10, 25, 100]}
      component="div"
      count={data.length}
      rowsPerPage={rowsPerPage}
      page={page}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
      labelRowsPerPage="Items por pagina"
      labelDisplayedRows={({ from, to, count }) => `Mostrando items del ${from}al ${to} de ${count} items`}
    />
  </Paper>
  )
}
