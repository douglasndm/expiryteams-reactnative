import 'styled-components';

declare module 'styled-components/native' {
    export interface DefaultTheme {
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

            productExpiredBackground: string;
            productNextToExpBackground: string;
            productThreatedBackground: string;
            productNextOrExpiredText: string;

            subscriptionBackground: string;
            subscriptionText: string;
        };
    }
}
