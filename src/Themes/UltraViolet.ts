import { darken } from 'polished';
import { DefaultTheme } from 'styled-components';

const UltraViolet: DefaultTheme = {
    colors: {
        primary: darken(0.1, '#7b00ba'),
        accent: darken(0.1, '#7b00ba'),
        background: '#000000',
        text: '#fff',
        subText: '#EAEAEA',
        textAccent: '#7b00ba',

        inputText: '#ffffff',
        inputBackground: '#373737',

        productBackground: '#373737',

        productExpiredBackground: darken(0.1, '#e01010'),
        productNextToExpBackground: darken(0.1, '#eded1f'),
        productThreatedBackground: '#b0b0b0',
        productNextOrExpiredText: '#FFF',

        subscriptionBackground: darken(0.2, '#000'),
        subscriptionText: '#000',
    },
};

export default UltraViolet;
