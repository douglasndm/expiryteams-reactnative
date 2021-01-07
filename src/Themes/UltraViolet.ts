import { darken } from 'polished';
import { DefaultTheme } from 'styled-components';

const UltraViolet: DefaultTheme = {
    name: 'Ultra violeta',

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
        productNextOrExpiredText: '#FFF',
    },
};

export default UltraViolet;
