import { FC, useReducer } from 'react';
import { AlertContext } from './AlertContext';
import { alertReducer } from './alertReducer';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

export interface AlertState {
    open: boolean;
    message: string;
    severity: AlertProps['severity'];
}

const ALERT_INITIAL_STATE: AlertState = {
    open: false,
    message: '',
    severity: 'info',
}

export const AlertProvider: FC<{ children: React.ReactNode; }> = ({ children }) => {
    const [state, dispatch] = useReducer(alertReducer, ALERT_INITIAL_STATE);

    const showAlert = (message: string, severity: AlertProps['severity'] = 'info') => {
        dispatch({ type: '[Alert] - Show', payload: { message, severity } });
    };

    const hideAlert = () => {
        dispatch({ type: '[Alert] - Hide' });
    };

    return (
        <AlertContext.Provider value={{ ...state, showAlert, hideAlert }}>
            {children}
            <Snackbar
                open={state.open}
                autoHideDuration={6000}
                onClose={hideAlert}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <MuiAlert onClose={hideAlert} severity={state.severity} elevation={6} variant="filled">
                    {state.message}
                </MuiAlert>
            </Snackbar>
        </AlertContext.Provider>
    );
};