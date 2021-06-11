import { darken } from 'polished';
import { DefaultTheme } from 'styled-components';

const DarkGreen: DefaultTheme = {
    colors: {
        primary: darken(0.1, '#33e860'),
        accent: darken(0.1, '#33e860'),
        background: '#000000',
        text: '#fff',
        subText: '#EAEAEA',
        textAccent: '#33e860',

        inputText: '#ffffff',
        inputBackground: '#373737',

        productBackground: '#373737',

        productExpiredBackground: darken(0.1, '#e01010'),
        productNextToExpBackground: darken(0.1, '#eded1f'),
        productThreatedBackground: darken(0.1, '#b0b0b0'),
        productNextOrExpiredText: '#FFF',

        subscriptionBackground: darken(0.2, '#000'),
        subscriptionText: '#000',
    },
};

export default DarkGreen;
