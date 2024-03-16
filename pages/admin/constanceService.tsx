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
    Grid,
    Stack,
    TextField,
} from "@mui/material";
import { AddOutlined } from "@mui/icons-material";
import { AdminLayout } from "../../components/layouts";
import { IConstanceService, ITicket, IUser } from "../../interfaces";
import { getUserData } from '../../database/dbUsers';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

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

const columns: GridColDef[] = [
    {
        field: 'provider',
        headerName: 'Proveedor',
        width: 150,
        sortable: false
    },
    {
        field: 'invoiceNumber',
        headerName: 'Factura N°',
        width: 150,
        sortable: false
    },
    {
        field: 'date',
        headerName: 'Fecha',
        width: 150,
        sortable: false
    },
    {
        field: 'amount',
        headerName: 'Importe',
        type: 'number',
        width: 110,
        sortable: false
    },
    {
        field: 'isSigned',
        headerName: 'Esta firmado?',
        width: 110,
        sortable: false
    },
    {
        field: 'concept',
        headerName: 'Concepto',
        width: 160,
        sortable: false
    },
    {
        field: 'action',
        headerName: 'Acciones',
        sortable: false,
        width: 160,
        renderCell: (params) => {
            const onClick = async (e) => {
                const row =params.row
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
                    link.setAttribute('download', `Constancia de servicio - ${row.provider} .pdf`);
                    document.body.appendChild(link);
                    link.click();
                  } else {
                    console.error('Error al generar el PDF:', response.statusText);
                  }
                } catch (error) {
                  console.error('Error al generar el PDF:', error.message);
                }
              };
            
            return (
              <Stack direction="row" spacing={2}>
                <Button variant="outlined" color="warning" size="small" onClick={onClick}>Descargar</Button>
              </Stack>
            );
        },
    },
];

const TicketsPage: FC<Props> = ({ }) => {
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
            <DataGrid
                rows={data}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 10,
                        },
                    },
                }}

                pageSizeOptions={[10]}
                disableRowSelectionOnClick
            />

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
