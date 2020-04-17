import { createMuiTheme } from '@material-ui/core/styles';

export const Mealtheme = createMuiTheme({
    typography: {
        fontFamily: [
            'Arial',
            'Source Sans Pro',
            'Helvetica Neue',
            'Helvetica',
            'sans-serif'
        ]
    },
    overrides: {
        'MuiButton': {
            'containedSecondary': {
                'background-color': 'yellow',
                'color': 'black'
            }
        },
        'MuiTableCell': {
            'footer': {
                'border': '0'
            }
        },
    }
});