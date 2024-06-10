import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card"
import CardHeader from "@mui/material/CardHeader"
import Typography from "@mui/material/Typography"
import CardContent from "@mui/material/CardContent"
import Stack from "@mui/material/Stack"
import IconButton from "@mui/material/IconButton"
import DialogContentText from "@mui/material/DialogContentText"
import { ShopLayout } from "../components/layouts";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import axios from "axios"
import { ChartsReferenceLine } from "@mui/x-charts/ChartsReferenceLine";
import { LinePlot, MarkPlot } from "@mui/x-charts/LineChart";
import { ChartsXAxis } from "@mui/x-charts/ChartsXAxis";
import { ChartsYAxis } from "@mui/x-charts/ChartsYAxis";
import { LineHighlightPlot } from "@mui/x-charts/LineChart";
import { ChartsAxisHighlight } from "@mui/x-charts/ChartsAxisHighlight";
import { ChartsTooltip } from "@mui/x-charts/ChartsTooltip";
import { ResponsiveChartContainer } from "@mui/x-charts/ResponsiveChartContainer"
import { GetServerSideProps } from "next";
import HistoryIcon from "@mui/icons-material/History";
import Button from "@mui/material/Button";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import { format, getMonth, getYear } from "date-fns";
import VerticalAlignBottomIcon from '@mui/icons-material/VerticalAlignBottom';
import VerticalAlignTopIcon from '@mui/icons-material/VerticalAlignTop';

const months = [
  'ENERO', 'FEBRERO', 'MARZO', 'ABRIL',
  'MAYO', 'JUNIO', 'JULIO', 'AGOSTO',
  'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'
];

const LaboratorySensor = ({ db }) => {
  const [data, setData] = useState(null);
  const [chart, setChart] = useState(db);
  const [open, setOpen] = React.useState(false);
  const [historyData, setHistoryData] = React.useState({
    sensorId: "",
    temp: [],
    timestamp: [],
  });
  const [dateStart, setDateStart] = React.useState<Date | null>(null);
  const [dateEnd, setDateEnd] = React.useState<Date | null>(null);
  const [dateDownload, setDateDownload] = React.useState<Date | null>(null);
  const [selectedSensorId, setSelectedSensorId] = React.useState< {alert:boolean,high:number,labId:string,low:number,nombre:string,sensorId:string,temp:string,time:number} | null>(null);

  const handleClickOpen = async (sensorId) => {
    setOpen(true);
    setSelectedSensorId(sensorId)
  };

  const handleClickSearch = async () => {
    try {
      const response = await axios.get(
        `https://api.frank4.com.ar/temperatura/${selectedSensorId.sensorId}`,
        {
          params: {
            sensorId: selectedSensorId.sensorId,
            startDate: dateStart.toISOString(),
            endDate: dateEnd.toISOString(),
          },
        }
      );
      const temperaturaData = response.data; // Ajusta según la estructura de datos recibida
      //console.log(temperaturaData);
      setHistoryData(temperaturaData); // Actualiza el estado con los datos nuevos

    } catch (error) {
      console.error("Error al obtener datos de temperatura:", error);
    }
  };

  const handleClickDownload = async () => {
    console.log(dateDownload.getMonth)
    console.log(dateDownload.getFullYear)
    console.log(selectedSensorId)
    try {
      const temp = await axios.get(
        `https://api.frank4.com.ar/temperaturaFiltrada/${selectedSensorId.sensorId}`,
        {
          params: {
            sensorId: selectedSensorId.sensorId,
            date: dateDownload.toISOString(),
          },
        }
      );

      console.log(temp.data)

      const requestBody = {
        data:temp.data,
        month:months[getMonth(dateDownload)],
        year:getYear(dateDownload),
        labId: selectedSensorId.labId,
        nombre:selectedSensorId.nombre
      }
      const response = await fetch('/api/generatePDFtemp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${selectedSensorId.labId}_${months[getMonth(dateDownload)]}_${getYear(dateDownload)}.pdf`);
        document.body.appendChild(link);
        link.click();
      } else {
        console.error('Error al generar el PDF:', response.statusText);
      }
    } catch (error) {
      console.error('Error al generar el PDF:', error.message);
    }
  };

  const handleClose = () => {
    setHistoryData({ sensorId: "", temp: [], timestamp: [] });
    setOpen(false);
    };
    
        
  useEffect(() => {
    let webSocket = new WebSocket("wss://node-red.frank4.com.ar/laboratorio");

    const connectWebSocket = () => {
      webSocket = new WebSocket("wss://node-red.frank4.com.ar/laboratorio");

      webSocket.onopen = () => {
        //console.log("WebSocket connection opened");
      };

      webSocket.onmessage = (event) => {
        const receivedData = JSON.parse(event.data);
        setData(receivedData);
        //console.log(receivedData)
      };

      webSocket.onclose = () => {
        //console.log("WebSocket connection closed. Reconnecting...");
        setTimeout(connectWebSocket, 3000); // Reconnect after 3 seconds
      };
    };
    connectWebSocket();
    // Cleanup WebSocket connection on component unmount
    return () => {
      webSocket.close();
    };
  }, []); // Empty dependency array ensures that this effect runs once on component mount

  const fetchTemperaturaData = async () => {
    try {
      const response = await axios.get("https://api.frank4.com.ar/temperatura");
      const temperaturaData = response.data; // Ajusta según la estructura de datos recibida
      //console.log(temperaturaData)
      setChart(temperaturaData); // Actualiza el estado con los datos nuevos
    } catch (error) {
      console.error("Error al obtener datos de temperatura:", error);
    }
  };

  useEffect(() => {
    // Llama a la función de solicitud HTTP al montar el componente
    fetchTemperaturaData();
    const intervalId = setInterval(() => {
      fetchTemperaturaData();
    }, 60000);
    return () => clearInterval(intervalId);
  }, []); // También ejecutará esta solicitud solo una vez al montar el componente

  return (
    <ShopLayout title={"Laboratorio"} pageDescription={""}>
          <Typography variant="h1" align="center" paddingBottom={2} >Monitoreo de temperatura</Typography>
      <Stack
        margin={"auto"}
        spacing={{ xs: 1, sm: 2 }}
        direction="row"
        useFlexGap
        flexWrap="wrap"
        justifyContent={"center"}
      >
        {data?.map((sensor, index) => (
          <Card
            sx={{
              width: 320,
              border: `1px solid ${sensor.alert ? "#ff5d68" : (parseFloat(sensor.temp) <= parseFloat(sensor.high) && parseFloat(sensor.temp) >= parseFloat(sensor.low) ? "#50b1fe" : "#ffb818")}`,
            }}
            key={sensor.sensorId}
            variant="outlined"
          >
            <CardHeader
              sx={{
                backgroundColor: sensor.alert ? "#ff5d68" : (parseFloat(sensor.temp) <= parseFloat(sensor.high) && parseFloat(sensor.temp) >= parseFloat(sensor.low) ? "#50b1fe" : "#ffb818"),
                height: 80,
                padding: 2
              }}
              title={
                <>
                  <Typography variant="h1" sx={{ color: "white", fontSize: 20 }}>
                    {sensor.nombre}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ color: "white", fontSize: 18 }}>
                    Cod: {sensor.labId}
                  </Typography>
                </>
              }
              avatar={
                sensor.alert ? (
                  <NotificationsActiveIcon
                    sx={{ color: "white", fontSize: 38 }}
                  />
                ) : (parseFloat(sensor.temp) <= parseFloat(sensor.high) && parseFloat(sensor.temp) >= parseFloat(sensor.low) ?
                  <ThermostatIcon sx={{ color: "white", fontSize: 38 }} />
                  :
                  <PriorityHighIcon sx={{ color: "white", fontSize: 38 }} />
                )
              }
              action={
                <IconButton onClick={() => handleClickOpen(sensor)}>
                  <HistoryIcon sx={{ color: "white", fontSize: 38 }} />
                </IconButton>
              }
            />
            <CardContent sx={{ padding: 0, margin: 0, paddingBottom: '2px !important', paddingTop: 2 }} >
              <Stack
                direction="row"
                justifyContent="space-evenly"
                alignItems="center"
              >
                <Box sx={{ width: "50%" }}>
                  <Typography variant="subtitle1" align="center">
                    Temperatura
                  </Typography>
                  <Typography
                    variant="h1"
                    align="center"
                    sx={{ color: "#202020", fontSize: 54 }}
                  >
                    {sensor.temp != "3276.70" ? sensor.temp + "°" : "ERROR"}
                  </Typography>
                </Box>
                <Stack direction="column" alignItems="flex-start" gap={0}>
                  <Stack direction="row" alignItems="center" spacing={0.5} sx={{ width: "100%" }}>
                    <VerticalAlignTopIcon />
                    <Typography variant="subtitle1" align="center" width={"100%"} lineHeight={1}>{sensor.high}</Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={0.5} width={"100%"}>
                    <VerticalAlignBottomIcon />
                    <Typography variant="subtitle1" align="center" width={"100%"} lineHeight={1}>{sensor.low}</Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <AccessAlarmIcon />
                    <Typography variant="subtitle1" align="center" lineHeight={1}> {`${Math.floor(sensor.time / 60)}:${sensor.time % 60 < 10 ? '0' : ''}${sensor.time % 60}`}</Typography>
                  </Stack>

                </Stack>
              </Stack>
              {chart?.map((item) => {
                if (item.sensorId === sensor.sensorId) {
                  const max =
                    parseInt(sensor.high) < Math.max(...item.temp)
                      ? Math.max(...item.temp)
                      : parseFloat(sensor.high);
                  const min =
                    parseInt(sensor.low) > Math.min(...item.temp)
                      ? Math.min(...item.temp)
                      : parseInt(sensor.low);
                  return (
                    <ResponsiveChartContainer
                      key={sensor.sensorId}
                      xAxis={[
                        {
                          data: item.timestamp.map(
                            (timestamp) => format(new Date(timestamp), "HH:mm")
                          ),
                          scaleType: "band",
                          max: new Date(item.timestamp[59]),
                          min: new Date(item.timestamp[0]),

                        },
                      ]}
                      yAxis={[
                        {
                          max: max + (max - min) * 0.1,
                          min: min - (max - min) * 0.1,
                          tickMinStep: (max - min) / 3,
                          tickMaxStep: (max - min) / 3,

                        },
                      ]}
                      series={[
                        {
                          data: item.temp,
                          type: "line",
                          label: "Temperatura",
                          showMark: false
                        },
                      ]}
                      width={320}
                      height={200}
                      margin={{ left: 30, right: 30, top: 30, bottom: 30 }}
                    >
                      <LinePlot />
                      <ChartsReferenceLine
                        y={sensor.high}
                        label="Max"
                        lineStyle={{ stroke: "red" }}
                      />
                      <ChartsReferenceLine
                        y={sensor.low}
                        label="Min"
                        lineStyle={{ stroke: "blue" }}
                      />
                      <ChartsXAxis
                      />
                      <ChartsYAxis />
                      <MarkPlot />
                      <LineHighlightPlot />
                      <ChartsAxisHighlight x="line" />
                      <ChartsTooltip trigger="axis" />
                    </ResponsiveChartContainer>
                  );
                }
              })}
            </CardContent>
          </Card>
        ))}
      </Stack>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth={"xl"}>
        <DialogTitle>Historial de temperatura</DialogTitle>
        <DialogContent>
          <DialogContentText paddingTop={1}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={2}
                
              >
                <Stack
                  direction="row"
                  justifyContent="flex-start"
                  alignItems="center"
                  spacing={2}
                  sx={{ display: { xs: 'none', sm: 'flex' } }}
                >
                  <DateTimePicker
                    label="Inicio"
                    //minDate={new Date(historyData?.timestamp[0])}
                    maxDate={dateEnd}
                    value={dateStart}
                    onChange={(newValue) => setDateStart(newValue)}
                    disableFuture
                    ampm={false}
                    format="dd/MM/yyyy HH:mm"
                  />
                  <DateTimePicker
                    label="Final"
                    minDate={dateStart}
                    value={dateEnd}
                    onChange={(newValue) => setDateEnd(newValue)}
                    disableFuture
                    ampm={false}
                    format="dd/MM/yyyy HH:mm"
                  />
                  <Button onClick={handleClickSearch}>Buscar</Button>
                </Stack>
                <Stack
                  direction="row"
                  justifyContent="flex-end"
                  alignItems="center"
                  spacing={2}
                >
                  <DateTimePicker
                    label="Mes"
                    //minDate={dateStart}
                    value={dateDownload}
                    onChange={(newValue) => setDateDownload(newValue)}
                    disableFuture
                    ampm={false}
                    //format="dd/MM/yyyy HH:mm"
                    views={['month', 'year']}
                  />
                  <Button onClick={handleClickDownload}>Descargar PDF</Button>
                </Stack>
              </Stack>
              <Typography paddingTop={2} variant="subtitle1" sx={{ display: { xs: 'flex', sm: 'none' } }}> Para acceder al historial debe ingresar desde una PC o Notebook. <br/> Puede descargar el registro mensual. </Typography>
            </LocalizationProvider>
          </DialogContentText>

          {historyData?.timestamp && (
            <ResponsiveChartContainer
              xAxis={[
                {
                  data: historyData.timestamp.map(
                    (timestamp) => format(new Date(timestamp), "dd/MM/yyyy HH:mm")
                  ),
                  scaleType: "band",
                },
              ]}
              series={[
                {
                  data: historyData.temp,
                  type: "line",
                  label: "Temperatura",
                  showMark: false,
                },
              ]}
              height={400}
              sx={{ display: { xs: 'none', sm: 'flex' } }}
            >
              <LinePlot />
              <ChartsXAxis />
              <ChartsYAxis />
              <MarkPlot />
              <LineHighlightPlot />
              <ChartsAxisHighlight x="line" />
              <ChartsTooltip trigger="axis" />
            </ResponsiveChartContainer>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cerrar</Button>
        </DialogActions>
      </Dialog>
      
    </ShopLayout>
  );
};

export default LaboratorySensor;

export const getServerSideProps: GetServerSideProps = async ({
  query,
  req,
}) => {
  const response = await axios.get("https://api.frank4.com.ar/temperatura");
  const db = response.data; // Ajusta según la estructura de datos recibida

  return {
    props: {
      db,
    },
  };
};
