import { DefaultTheme } from 'styled-components';
import { darken } from 'polished';

const Florest: DefaultTheme = {
    colors: {
        primary: '#B2EDC5',
        accent: '#B2EDC5',
        background: '#f6f6f6',
        text: '#7C7287',
        subText: '#9DC0BC',
        textAccent: '#B2EDC5',

        inputText: '#050505',
        inputBackground: '#FFF',

        productBackground: '#FFF',

        productExpiredBackground: '#CC4B4B',
        productNextToExpBackground: '#DDE053',
        productThreatedBackground: '#b0b0b0',
        productNextOrExpiredText: '#FFF',

        subscriptionBackground: darken(0.2, '#fff'),
        subscriptionText: '#000',
    },
};

export default Florest;
