import { Alert, Box, CircularProgress, Snackbar, Typography } from '@mui/material'
import React, { FC } from 'react'

interface Props {
    message: string;
    open: boolean;
    type: "FAIL" | "SUCCESS" | "PROGRESS"|null
}

export const DialogAlert: FC<Props> = ({ message, type, open }) => {
    const [openSuccess, setOpenSuccess] = React.useState(false);
    const [openFail, setOpenFail] = React.useState(false);
    const [openProgress, setOpenProgress] = React.useState(false);
    //const [message, setMessage] = React.useState("");

    const handleCloseAlert = (e) => {
        setOpenFail(false)
        setOpenSuccess(false)
    };

    return (
        <>
            <Snackbar open={open && type === "SUCCESS"} autoHideDuration={3000} onClose={handleCloseAlert} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert
                    onClose={handleCloseAlert}
                    severity="success"
                    sx={{ width: "100%" }}
                >
                    {message}
                </Alert>
            </Snackbar>
            <Snackbar open={open && type === "FAIL"} autoHideDuration={3000} onClose={handleCloseAlert} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert
                    onClose={handleCloseAlert}
                    severity="error"
                    sx={{ width: "100%" }}
                >
                    {message}
                </Alert>
            </Snackbar>
            <Snackbar open={open && type === "PROGRESS"} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert
                    severity="info"
                    sx={{ width: "100%" }}
                >
                    Procesando solicitud
                </Alert>
            </Snackbar>
        </>

    )
}
