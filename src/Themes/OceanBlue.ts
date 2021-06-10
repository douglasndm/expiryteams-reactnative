import { DefaultTheme } from 'styled-components';
import { darken } from 'polished';

const OceanBlue: DefaultTheme = {
    colors: {
        primary: '#69dafa',
        accent: '#69dafa',
        background: '#f6f6f6',
        text: '#000',
        subText: '#999999',
        textAccent: '#69dafa',

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

export default OceanBlue;
