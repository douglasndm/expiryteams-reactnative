import 'styled-components';

declare module 'styled-components/native' {
    export interface DefaultTheme {
        name: string;
        key: string;
        isPro: boolean;
        isDark: boolean;

        colors: {
            primary: string;
            accent: string;
            background: string;
            text: string;
            subText: string;
            textAccent: string;

            inputText: string;
            placeholderColor: string;
            inputBackground: string;

            productBackground: string;
            productCardText: string;

            productExpiredBackground: string;
            productNextToExpBackground: string;
            productThreatedBackground: string;
            productNextOrExpiredText: string;

            TabBackground: string;
            TabText: string;
            TabTextSelected: string;
        };
    }
}

interface ITheme {
    name: string;

    colors: {
        primary: string;
        accent: string;
        background: string;
        text: string;
        subText: string;
        textAccent: string;

        inputText: string;
        inputBackground: string;

        productBackground: string;
        productCardText: string;

        productExpiredBackground: string;
        productNextToExpBackground: string;
        productThreatedBackground: string;
        productNextOrExpiredText: string;
    };
}
