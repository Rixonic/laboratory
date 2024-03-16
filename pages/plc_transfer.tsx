import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardContent,
  Stack,
  Box,
  IconButton,
  Input,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";
import { ShopLayout } from "../components/layouts";



const PlcTransfer = ({  }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    let webSocket = new WebSocket("ws://192.168.0.50:1880/plc_transferencia");

    const connectWebSocket = () => {
      webSocket = new WebSocket("ws://192.168.0.50:1880/plc_transferencia");

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


  return (
    <ShopLayout title={"Laboratorio"} pageDescription={""}>

      <></>
    </ShopLayout>
  );
};

export default PlcTransfer;
