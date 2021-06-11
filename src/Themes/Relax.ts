import { darken } from 'polished';
import { DefaultTheme } from 'styled-components';

const Relax: DefaultTheme = {
    colors: {
        primary: '#99e1d9',
        accent: '#99e1d9',
        background: '#f0f7f4',
        text: '#32292f',
        subText: '#705d56',
        textAccent: '#99e1d9',

        inputText: '#32292f',
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

export default Relax;
