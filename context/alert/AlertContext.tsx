import { createContext } from 'react';
import { AlertProps } from '@mui/material/Alert';

interface ContextProps {
    open: boolean;
    message: string;
    severity: AlertProps['severity'];
    showAlert: (message: string, severity?: AlertProps['severity']) => void;
    hideAlert: () => void;
}

export const AlertContext = createContext({} as ContextProps);