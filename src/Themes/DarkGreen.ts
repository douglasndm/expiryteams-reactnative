import { darken } from 'polished';
import { DefaultTheme } from 'styled-components';

const DarkGreen: DefaultTheme = {
    name: 'Dark Green',

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
        productNextOrExpiredText: '#FFF',
    },
};

export default DarkGreen;
