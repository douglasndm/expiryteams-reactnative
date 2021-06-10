import { darken } from 'polished';
import { DefaultTheme } from 'styled-components';

const Dark: DefaultTheme = {
    colors: {
        primary: darken(0.1, '#5856d6'),
        accent: darken(0.1, '#5856d6'),
        background: 'rgba(0, 0, 0, 0.85)',
        text: '#fff',
        subText: '#EAEAEA',
        textAccent: '#5856d6',

        inputText: '#ffffff',
        inputBackground: '#565657',

        productBackground: '#565657',

        productExpiredBackground: darken(0.1, '#CC4B4B'),
        productNextToExpBackground: darken(0.1, '#DDE053'),
        productThreatedBackground: darken(0.1, '#b0b0b0'),
        productNextOrExpiredText: '#FFF',

        subscriptionBackground: darken(0.2, '#fff'),
        subscriptionText: '#000',
    },
};

export default Dark;
