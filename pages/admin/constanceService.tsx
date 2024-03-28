import { getSession} from 'next-auth/react';
import { GetServerSideProps } from "next";
import { useForm } from "react-hook-form";
import {
    FC,
    useEffect,
    useState,
} from "react";
import { tesloApi } from "../../api";
import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Alert from "@mui/material/Alert";
import {
    Box,
    Button,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
} from "@mui/material";
import { AddOutlined } from "@mui/icons-material";
import { AdminLayout } from "../../components/layouts";
import { IConstanceService, ITicket, IUser } from "../../interfaces";
import { getUserData } from '../../database/dbUsers';

interface FormData {
    _id?: string;
    provider: string;
    invoiceNumber: string;
    date: Date;
    amount: Number;
    concept: string;
    isSigned: boolean;
}

interface Props {
    ticket: ITicket;
    userData: IUser;
    filteredTicketJSON: string;
}

interface Column {
    id: string;
    label: string;
    minWidth?: number;
    align?: 'center';
    format?: (row: IConstanceService) => React.JSX.Element;
  }  

  const onClick = async (row) => {
    console.log(row);
    try {
        const response = await fetch('/api/generatePDF', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(row),
        });

        if (response.ok) {
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Constancia de servicio - ${row.provider}.pdf`);
            document.body.appendChild(link);
            link.click();
        } else {
            console.error('Error al generar el PDF:', response.statusText);
        }
    } catch (error) {
        console.error('Error al generar el PDF:', error.message);
    }
};

const columns: Column[] = [
    { id: 'provider', label: 'Proveedor', minWidth: 170 },
    { id: 'invoiceNumber', label: 'Factura N', minWidth: 100 },
    { id: 'date', label: 'Fecha', minWidth: 100 },
    { id: 'amount', label: 'Importe', minWidth: 100 },
    { id: 'isSigned', label: 'Esta firmado?', minWidth: 100 },
    { id: 'concept', label: 'Concepto', minWidth: 100 },
    {
      id: 'download',
      label: 'Descargar',
      minWidth: 70,
      align: 'center',
      format: (row: IConstanceService) => (
        <Stack direction="row" spacing={2}>
            <Button variant="outlined" color="warning" size="small" onClick={() => onClick(row)}>Descargar</Button>
        </Stack>
      ),
    },
  ];

const TicketsPage: FC<Props> = ({ }) => {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [data, setData] = useState<IConstanceService[] | []>([]);
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({

    });

    const [open, setOpen] = React.useState(false);

    const onSubmit = async (form: FormData) => {
        setOpen(false);
        console.log(form)

        try {
            const { data } = await tesloApi({
                url: "/admin/constanceService",
                method: "POST",
                data: form,
            });
        } catch (error) {
            console.log(error);
            <Alert severity="error">Ups! Hubo un problema</Alert>;

        }

    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
      };
    
      const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
      };

    const getConstances = async () => {
        try {
            const { data } = await tesloApi({
                url: "/admin/constanceService",
                method: "GET",
            });
            console.log(data)
            setData(data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleClose = () => {
        setOpen(false);
        <Alert severity="success">Su ticket a sido creado exitosamente</Alert>;
    };


    useEffect(() => {
        getConstances();
    }, []);

    return (

        <AdminLayout
            title={"Constancia de servicio"}
            subTitle={"Historial"}
        >

            <Box display="flex" justifyContent="end" sx={{ mb: 2 }}>
                <Button
                    startIcon={<AddOutlined />}
                    color="secondary"
                    onClick={handleClickOpen}
                >
                    Crear constancia
                </Button>
            </Box>
            <Paper sx={{ width: '100%' }} >
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table aria-label="sticky table">
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
              {data
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
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Items por pagina"
          labelDisplayedRows={({ from, to, count }) => `Mostrando items del ${from}al ${to} de ${count} items`}
        />
      </Paper>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Nueva constancia</DialogTitle>
                <DialogContent> 

                    <form onSubmit={handleSubmit(onSubmit)}>

                        <TextField
                            label="Proveedor"
                            defaultValue=""
                            fullWidth
                            variant="outlined"
                            sx={{ mb: 1 }}
                            {...register("provider")}
                        />
                        <TextField
                            label="Factura N"
                            defaultValue=""
                            fullWidth
                            variant="outlined"
                            sx={{ mb: 1 }}
                            {...register("invoiceNumber")}
                        />
                        <div style={{ display: "flex", gap: 8 }}>
                            <TextField
                                label="Fecha"
                                type='date'
                                fullWidth
                                variant="outlined"
                                sx={{ mb: 1 }}
                                {...register("date")}
                            />
                            <TextField
                                type='number'
                                label="Importe"
                                defaultValue=""
                                fullWidth
                                variant="outlined"
                                sx={{ mb: 1 }}
                                {...register("amount")}
                                inputProps={{ step: "0.01", lang: "en-US" }}
                            />
                        </div>
                        <TextField
                            label="Concepto"
                            defaultValue=""
                            fullWidth
                            variant="outlined"
                            sx={{ mb: 1 }}
                            {...register("concept")}
                        />

                        <Button color="secondary" type="submit" >
                            Guardar
                        </Button>
                    </form>
                </DialogContent>
                <DialogActions>

                    <Button onClick={handleClose}>Cancelar</Button>
                </DialogActions>
            </Dialog>

            


        </AdminLayout>
    );
};

export const getServerSideProps: GetServerSideProps = async ({ query, req }) => {

    let constance: IConstanceService | null;

    const session = await getSession({ req });
    const userData = await getUserData(session.user.email)

    return {
        props: {

        },
    };
};

export default TicketsPage;
