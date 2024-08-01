import { AlertState } from './AlertProvider';

type AlertActionType =
    | { type: '[Alert] - Show', payload: { message: string, severity: string } }
    | { type: '[Alert] - Hide' }

export const alertReducer = (state: AlertState, action: AlertActionType): AlertState => {
    switch (action.type) {
        case '[Alert] - Show':
            return {
                ...state,
                open: true,
                message: action.payload.message,
                severity: action.payload.severity as AlertState['severity'],
            }
        case '[Alert] - Hide':
            return {
                ...state,
                open: false,
                message: '',
                severity: 'info',
            }
        default:
            return state;
    }
}