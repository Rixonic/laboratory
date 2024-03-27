import { getSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import { useForm } from "react-hook-form";
import { FC, useEffect, useState } from "react";
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
  MenuItem,
  Snackbar,
  Stack,
  TextField,
} from "@mui/material";
import { AddOutlined } from "@mui/icons-material";
import { AdminLayout } from "../../components/layouts";
import DeleteIcon from "@mui/icons-material/Delete";
import { IRequerimient, IRequerimientItem, IUser } from "../../interfaces";
import { getUserData } from "../../database/dbUsers";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { validLocations } from "../../utils/validLocations";
import { months } from "../../utils/months";
import DownloadIcon from '@mui/icons-material/Download'; 
import EmailIcon from '@mui/icons-material/Email';

function Row(props: { row: IRequerimient }) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);


  const handleDownload = async (e) => {
    try {
        const response = await fetch('/api/generatePDFrequerimient', {
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
          link.setAttribute('download', `Requerimiento - ${row.requerimientId} .pdf`);
          document.body.appendChild(link);
          link.click();
        } else {
          console.error('Error al generar el PDF:', response.statusText);
        }
      } catch (error) {
        console.error('Error al generar el PDF:', error.message);
      }
  };

  const handleDelete = (e) => {
    console.log(e)
  };

  const handleSend = (e) => {
    console.log(e)
  };




  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.requerimientId}
        </TableCell>
        <TableCell>{row.severity}</TableCell>
        <TableCell>{row.expectedMonth}</TableCell>
        <TableCell>{row.service}</TableCell>
        <TableCell>{row.destination}</TableCell>
        <TableCell>{row.comment}</TableCell>
        <TableCell>{row.createdBy}</TableCell>
        <TableCell>{row.createdAt}</TableCell>
        <TableCell>{row.isSigned ? "Si" : "No "}</TableCell>
        <TableCell >
          <IconButton aria-label="delete" onClick={()=> handleDelete(row)}>
            <DeleteIcon />
          </IconButton>
          <IconButton aria-label="delete" onClick={()=> handleDownload(row)}>
            <DownloadIcon />
          </IconButton>
          <IconButton aria-label="delete" onClick={()=> handleSend(row)}>
            <EmailIcon />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Listado de productos
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Item</TableCell>
                    <TableCell>Cant.</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Descripcion</TableCell>
                    <TableCell>Marca</TableCell>
                    <TableCell>Modelo</TableCell>
                    <TableCell>Motivo</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.items?.map((itemRow) => (
                    <TableRow key={itemRow.item}>
                      <TableCell>{itemRow.item}</TableCell>
                      <TableCell>{itemRow.quantity}</TableCell>
                      <TableCell>{itemRow.type}</TableCell>
                      <TableCell>{itemRow.description}</TableCell>
                      <TableCell>{itemRow.brand}</TableCell>
                      <TableCell>{itemRow.model}</TableCell>
                      <TableCell>{itemRow.reason}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

interface FormData {
  _id?: string;
  requerimientId: string;
  severity: string;
  expectedMonth: string;
  service: string;
  destination: string;
  comment: string;
  createdBy: string;
  items: {
    item: number;
    quantity: number;
    type: string;
    description: string;
    brand: string;
    model: string;
    reason: string;
  }[];
  isSigned: boolean;
}

interface Props {
  requerimient: IRequerimient;
  userData: IUser;
  filteredTicketJSON: string;
}

const TicketsPage: FC<Props> = ({ userData }) => {
  const [openSuccess, setOpenSuccess] = React.useState(false);
  const [openFail, setOpenFail] = React.useState(false);
  const [openProgress, setOpenProgress] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [index, setIndex] = useState (1)
  const [items, setItems] = useState<IRequerimientItem[] | []>([
    {
      item: 0 ,
      quantity: 0,
      type: "",
      description: "",
      brand: "",
      model: "",
      reason: "",
    },
  ]);
  const [data, setData] = useState<IRequerimient[] | []>([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({});

  const [open, setOpen] = React.useState(false);

  const onSubmit = async (form: FormData) => {
    setOpenProgress(true);
    form.createdBy = userData.name;
    form.items = items;
    form.isSigned = false;
    console.log(form);

    try {
      const { data } = await tesloApi({
        url: "/admin/requerimient",
        method: "POST",
        data: form,
      });
      console.log(data)
      setOpenProgress(false);
      setMessage(data.message)
      setOpenSuccess(true)
    } catch (error) {
      setOpenFail(true)
      console.log(error);
      
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const getRequerimients = async () => {
    try {
      const { data } = await tesloApi({
        url: "/admin/requerimient",
        method: "GET",
      });
      console.log(data);
      setData(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => {
    setOpen(false);
    <Alert severity="success">Su ticket a sido creado exitosamente</Alert>;
  };

  const handleClickAdd = () => {
    setIndex (index+1)
    setItems([
      ...items,
      {
        item: index,
        quantity: 0,
        type: "",
        description: "",
        brand: "",
        model: "",
        reason: "",
      },
    ]);
  };
  const handleChange = (e, i) => {
    const { name, value } = e.target;
    const onchangeVal = [...items];
    onchangeVal[i][name] = value;
    setItems(onchangeVal);
  };

  const handleDelete = (i) => {
    const deleteVal = [...items];
    deleteVal.splice(i, 1);
    setItems(deleteVal);
  };

  const handleCloseAlert = (e) => {
    setOpenFail(false)
    setOpenSuccess(false)
  };

  useEffect(() => {
    getRequerimients();
  }, []);

  return (
    <AdminLayout title={"Requerimiento"} subTitle={"Historial"}>
      <Box display="flex" justifyContent="end" sx={{ mb: 2 }}>
        <Button
          startIcon={<AddOutlined />}
          color="secondary"
          onClick={handleClickOpen}
        >
          Nuevo requerimiento
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Req N</TableCell>
              <TableCell>Urgencia</TableCell>
              <TableCell>Fecha de entrega requerida</TableCell>
              <TableCell>Servicio</TableCell>
              <TableCell>Entregar a:</TableCell>
              <TableCell>Comentario</TableCell>
              <TableCell>Creado por:</TableCell>
              <TableCell>Creado el:</TableCell>
              <TableCell>Esta firmado?:</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <Row key={row._id} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} fullWidth={true} maxWidth={false}>
        <DialogTitle>Nuevo requerimiento </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={1} minWidth={"50%"} paddingTop={2}>
              <Grid item xs={6}>
                <TextField
                  required
                  select
                  label="Urgencia"
                  defaultValue=""
                  variant="outlined"
                  sx={{ mb: 1 }}
                  fullWidth
                  {...register("severity")}
                >
                  <MenuItem value={"A"}> ALTO </MenuItem>
                  <MenuItem value={"M"}> MEDIO </MenuItem>
                  <MenuItem value={"B"}> BAJO </MenuItem>
                </TextField>
                <TextField
                  required
                  select
                  label="Fecha de entrega requerida"
                  defaultValue=""
                  variant="outlined"
                  sx={{ mb: 1 }}
                  fullWidth
                  {...register("expectedMonth")}
                >
                  {months.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  select
                  required
                  label="Destino"
                  defaultValue=""
                  variant="outlined"
                  sx={{ mb: 1 }}
                  fullWidth
                  {...register("service")}
                >
                  {validLocations.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  label="Entregar a:"
                  required
                  defaultValue=""
                  variant="outlined"
                  sx={{ mb: 1 }}
                  fullWidth
                  {...register("destination")}
                />
              </Grid>
            </Grid>
            {items.map((val, i) => (
              <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={2}
                marginTop={1}
                marginBottom={1}
                key={val.item}
              >
                <TextField
                  label="Cant."
                  required
                  type="number"
                  variant="outlined"
                  name="quantity"
                  value={val.quantity}
                  onChange={(e) => handleChange(e, i)}
                  size="small"
                  sx={{ width: 120 }}
                />
                <TextField
                  required
                  label="Unidad"
                  variant="outlined"
                  name="type"
                  value={val.type}
                  onChange={(e) => handleChange(e, i)}
                  size="small"
                  sx={{ width: 180 }}
                />
                <TextField
                required
                  label="Descripcion"
                  variant="outlined"
                  name="description"
                  value={val.description}
                  onChange={(e) => handleChange(e, i)}
                  size="small"
                  fullWidth
                />
                <TextField
                  label="Marca"
                  variant="outlined"
                  name="brand"
                  value={val.brand}
                  onChange={(e) => handleChange(e, i)}
                  size="small"
                />
                <TextField
                  label="Modelo"
                  variant="outlined"
                  name="model"
                  value={val.model}
                  onChange={(e) => handleChange(e, i)}
                  size="small"
                />
                <TextField
                  label="Motivo"
                  variant="outlined"
                  name="reason"
                  value={val.reason}
                  onChange={(e) => handleChange(e, i)}
                  size="small"
                />
                <IconButton aria-label="delete" onClick={() => handleDelete(i)}>
                  <DeleteIcon />
                </IconButton>
              </Stack>
            ))}
            <Button sx={{ display: 'block', margin: '0 auto', marginTop: 2,marginBottom: 2}} onClick={handleClickAdd}>Agregar item</Button>
            <TextField
              label="Comentario"
              defaultValue=""
              fullWidth
              variant="outlined"
              sx={{ mb: 1 }}
              {...register("comment")}
            />

            <Button color="secondary" type="submit">
              Guardar
            </Button>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
        </DialogActions>
      </Dialog>


      <Snackbar open={openSuccess} autoHideDuration={3000} onClose={handleCloseAlert} anchorOrigin =  { { vertical: 'top', horizontal: 'center' } }>
          <Alert
            onClose={handleCloseAlert}
            severity="success"
            sx={{ width: "100%" }}
          >
            {message}
          </Alert>
        </Snackbar>
        <Snackbar open={openFail} autoHideDuration={3000} onClose={handleCloseAlert} anchorOrigin =  { { vertical: 'top', horizontal: 'center' } }>
          <Alert
            onClose={handleCloseAlert}
            severity="error"
            sx={{ width: "100%" }}
          >
            {message}
          </Alert>
        </Snackbar>
        <Snackbar open={openProgress}  anchorOrigin =  { { vertical: 'top', horizontal: 'center' } }>
          <Alert
            severity="info"
            sx={{ width: "100%" }}
          >
            Procesando solicitud
          </Alert>
        </Snackbar>
    </AdminLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  query,
  req,
}) => {
  const session = await getSession({ req });
  const userData = await getUserData(session.user.email);

  delete userData._id;

  return {
    props: {
      userData,
    },
  };
};

export default TicketsPage;
